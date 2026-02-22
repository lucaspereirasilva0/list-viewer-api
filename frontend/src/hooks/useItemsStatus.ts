import { useMemo } from "react";
import { Item } from "../api/item";

export function useItemsStatus(items: Item[] | undefined) {
  return useMemo(() => {
    if (!items || items.length === 0) {
      return {
        isEmpty: true,
        allActive: false,
        allInactive: false,
        hasMixed: false,
        activeCount: 0,
        inactiveCount: 0,
        totalCount: 0,
        shouldActivateAll: true,
      };
    }

    const activeCount = items.filter((item) => item.active).length;
    const inactiveCount = items.length - activeCount;
    const allActive = activeCount === items.length && items.length > 0;
    const allInactive = inactiveCount === items.length && items.length > 0;
    const hasMixed = !allActive && !allInactive;

    // Se há mais inativos que ativos (ou empate), ativamos todos
    const shouldActivateAll = activeCount <= items.length / 2;

    return {
      isEmpty: false,
      allActive,
      allInactive,
      hasMixed,
      activeCount,
      inactiveCount,
      totalCount: items.length,
      shouldActivateAll,
    };
  }, [items]);
}
