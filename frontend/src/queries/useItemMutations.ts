import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem, deleteItem, toggleItem, Item } from "../api/item";
import toast from "react-hot-toast";

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onMutate: async (newItem) => {
      await qc.cancelQueries({ queryKey: ["items"] });
      const previousItems = qc.getQueryData<Item[]>(["items"]);
      qc.setQueryData<Item[]>(["items"], (old) =>
        old
          ? [...old, { ...newItem, id: String(Date.now()), active: true }]
          : [],
      );
      return { previousItems };
    },
    onError: (err, newTodo, context) => {
      toast.error("Não foi possível adicionar o item");
      if (context?.previousItems) {
        qc.setQueryData<Item[]>(["items"], context.previousItems);
      }
    },
    onSettled: () => {
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
    mutationFn: toggleItem,
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
