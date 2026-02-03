import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createItem,
  deleteItem,
  Item,
  updateItem,
} from "../api/item";
import toast from "react-hot-toast";

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onMutate: async (newItem) => {
      await qc.cancelQueries({ queryKey: ["items"] });
      const previousItems = qc.getQueryData<Item[]>(["items"]);
      const tempId = `optimistic-${Date.now()}`;
      const optimisticItem = { ...newItem, id: tempId, active: true };

      qc.setQueryData<Item[]>(["items"], (old) =>
        old ? [...old, optimisticItem] : [optimisticItem],
      );

      return { previousItems, optimisticItem };
    },
    onError: (err, newTodo, context) => {
      toast.error("Não foi possível adicionar o item");
      if (context?.previousItems) {
        qc.setQueryData<Item[]>(["items"], context.previousItems);
      }
    },
    onSuccess: (data, variables, context) => {
      qc.setQueryData<Item[]>(["items"], (old) =>
        old
          ? old.map((item) =>
              item.id === context?.optimisticItem.id ? data : item,
            )
          : [data],
      );
      toast.success("Item adicionado com sucesso!");
      qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onMutate: async (idToDelete) => {
      await qc.cancelQueries({ queryKey: ["items"] });
      const previousItems = qc.getQueryData<Item[]>(["items"]);
      qc.setQueryData<Item[]>(["items"], (old) =>
        old ? old.filter((item) => item.id !== idToDelete) : [],
      );
      return { previousItems };
    },
    onError: (err, idToDelete, context) => {
      toast.error("Erro ao remover item");
      if (context?.previousItems) {
        qc.setQueryData<Item[]>(["items"], context.previousItems);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useToggleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateItem,
    onMutate: async (itemToToggle) => {
      await qc.cancelQueries({ queryKey: ["items"] });
      const previousItems = qc.getQueryData<Item[]>(["items"]);
      qc.setQueryData<Item[]>(["items"], (old) =>
        old
          ? old.map((item) =>
              item.id === itemToToggle.id
                ? { ...item, active: itemToToggle.active }
                : item,
            )
          : [],
      );
      return { previousItems };
    },
    onError: (err, itemToToggle, context) => {
      toast.error("Erro ao atualizar item");
      if (context?.previousItems) {
        qc.setQueryData<Item[]>(["items"], context.previousItems);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateItem,
    onMutate: async (updatedItem) => {
      await qc.cancelQueries({ queryKey: ["items"] });
      const previousItems = qc.getQueryData<Item[]>(["items"]);

      qc.setQueryData<Item[]>(["items"], (old) =>
        old
          ? old.map((item) =>
              item.id === updatedItem.id
                ? { ...item, name: updatedItem.name }
                : item,
            )
          : [],
      );
      return { previousItems };
    },
    onError: (err, updatedItem, context) => {
      toast.error("Erro ao atualizar item");
      if (context?.previousItems) {
        qc.setQueryData<Item[]>(["items"], context.previousItems);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
