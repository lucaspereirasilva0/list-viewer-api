import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem, deleteItem, toggleItem } from "../api/item";
import toast from "react-hot-toast";

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
    },
    onError: () => {
      toast.error("Não foi possível adicionar o item");
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
    },
    onError: () => {
      toast.error("Erro ao remover item");
    },
  });
}

export function useToggleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar item");
    },
  });
}
