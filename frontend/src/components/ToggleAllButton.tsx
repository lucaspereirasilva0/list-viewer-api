import { useCallback } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { Item } from "../api/item";
import { useItemsStatus } from "../hooks/useItemsStatus";
import { useToggleAllItems } from "../queries/useItemMutations";

interface ToggleAllButtonProps {
  items: Item[] | undefined;
  disabled?: boolean;
}

export function ToggleAllButton({
  items,
  disabled = false,
}: ToggleAllButtonProps) {
  const itemsStatus = useItemsStatus(items);
  const toggleAllItems = useToggleAllItems();

  const handleClick = useCallback(() => {
    if (!items || items.length === 0) return;
    toggleAllItems.mutate(items);
  }, [items, toggleAllItems]);

  if (itemsStatus.isEmpty) {
    return null;
  }

  const buttonLabel = itemsStatus.shouldActivateAll
    ? "Ativar todos os itens"
    : "Desativar todos os itens";

  const Icon = itemsStatus.shouldActivateAll ? FaCheckCircle : FaRegCircle;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || toggleAllItems.isPending}
      aria-label={buttonLabel}
      aria-busy={toggleAllItems.isPending}
      className={`p-3 rounded-soft font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-soft ${
        itemsStatus.shouldActivateAll
          ? "bg-primary text-white dark:hover:bg-opacity-90"
          : "bg-accent text-white dark:hover:bg-opacity-90"
      } ${
        toggleAllItems.isPending || disabled
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      title={buttonLabel}
    >
      <Icon
        className={`w-6 h-6 ${toggleAllItems.isPending ? "animate-pulse" : ""}`}
      />
    </button>
  );
}
