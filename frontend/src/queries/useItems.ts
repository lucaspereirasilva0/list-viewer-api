import { useQuery } from "@tanstack/react-query";
import { listItems, Item } from "../api/item";

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: listItems,
  });
}
