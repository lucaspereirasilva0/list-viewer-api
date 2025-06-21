import { useItems } from "../queries/useItems";
import { useDeleteItem, useToggleItem } from "../queries/useItemMutations";
import { Item } from "../api/item";
import ErrorBanner from "../components/ErrorBanner";
import { useState, useRef, useEffect } from "react";
import { useCreateItem } from "../queries/useItemMutations";
import { useUpdateItem } from "../queries/useItemMutations";
import { ItemSkeleton } from "../components/ItemSkeleton";
import { ListItem } from "../components/ListItem";
import { FaCheck, FaTimes, FaPlus } from "react-icons/fa";

export function ListPage() {
  const { data: items, isLoading, error } = useItems();
  const deleteItem = useDeleteItem();
  const toggleItem = useToggleItem();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const contentEditableNewItemRef = useRef<HTMLDivElement>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (isAddingNewItem && contentEditableNewItemRef.current) {
      setTimeout(() => {
        if (contentEditableNewItemRef.current) {
          contentEditableNewItemRef.current.focus();
          const range = document.createRange();
          const selection = window.getSelection();

          // Ensure there's a text node to set the cursor on
          if (!contentEditableNewItemRef.current.firstChild) {
            contentEditableNewItemRef.current.appendChild(
              document.createTextNode(""),
            );
          }

          range.setStart(
            contentEditableNewItemRef.current.firstChild,
            contentEditableNewItemRef.current.firstChild.nodeValue?.length || 0,
          );
          range.collapse(true); // Collapse to the end

          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0); // Small delay to allow DOM to update
    }
  }, [isAddingNewItem]);

  const handleCreateSubmit = () => {
    const name = contentEditableNewItemRef.current?.innerText.trim() || "";
    if (!name) return;
    createItem.mutate(
      { name: name },
      {
        onSuccess: () => {
          setNewItemName("");
          setIsAddingNewItem(false);
        },
      },
    );
  };

  const handleCancelNewItem = () => {
    setIsAddingNewItem(false);
    setNewItemName("");
  };

  const handleEdit = (item: Item) => {
    setEditingItemId(item.id);
  };

  const handleSaveEdit = (item: Item) => {
    if (!item.name.trim()) return;
    updateItem.mutate(
      { ...item, name: item.name.trim() },
      {
        onSuccess: () => {
          setEditingItemId(null);
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleToggle = (item: Item) => {
    toggleItem.mutate({ ...item, active: !item.active });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Sua Lista de Compras
      </h1>
      {isLoading && (
        <ul className="space-y-3 mt-4">
          {[...Array(3)].map((_, index) => (
            <ItemSkeleton key={index} />
          ))}
        </ul>
      )}

      {error && <ErrorBanner msg="Falha ao carregar itens" />}

      {!isLoading && !error && (
        <>
          {(!items || items.length === 0) && !isAddingNewItem ? (
            <div className="flex flex-col items-center justify-center h-screen px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-24 h-24 text-gray-400 dark:text-gray-500 mb-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.023.832l.236 1.626c.092.636.574 1.144 1.206 1.258l7.105 1.185c.677.113 1.238.618 1.458 1.29l1.632 4.903c.237.712-.224 1.453-.94 1.453H9.982a.875.875 0 01-.872-.775l-.277-2.775a.875.875 0 01.872-.975h7.25c.348 0 .638-.282.684-.627l1.01-3.028M2.25 3L.659 6.273M15.75 12h2.25m-11.5 2.25h8.25"
                />
              </svg>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 text-center">
                Parece que sua lista de compras está vazia.
              </p>
              <button
                onClick={() => {
                  setIsAddingNewItem(true);
                  setNewItemName("");
                }}
                aria-label="Adicione seu primeiro item!"
                className="p-2 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                <FaPlus className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {isAddingNewItem && (
                  <li className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 transition-all duration-200 ease-in-out hover:shadow-lg">
                    <div
                      ref={contentEditableNewItemRef}
                      className="flex-1 text-lg font-medium text-gray-900"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateSubmit();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          handleCancelNewItem();
                        }
                      }}
                      onBlur={(e) => {
                        const name = e.currentTarget.innerText.trim();
                        if (!name) {
                          handleCancelNewItem();
                        } else {
                          handleCreateSubmit();
                        }
                      }}
                    >
                      {newItemName || "\u00A0"}
                    </div>
                    <div className="flex items-center flex-wrap justify-end gap-2">
                      <button
                        onClick={handleCreateSubmit}
                        aria-label="Adicionar item"
                        className="p-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors duration-200"
                      >
                        <FaCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelNewItem}
                        aria-label="Cancelar adição de item"
                        className="p-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-colors duration-200"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                )}
                {items &&
                  items.length > 0 &&
                  items.map((item) => (
                    <ListItem
                      key={item.id}
                      item={item}
                      editingItemId={editingItemId}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                    />
                  ))}
              </ul>

              {items && items.length > 0 && !isAddingNewItem && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      setIsAddingNewItem(true);
                      setNewItemName("");
                    }}
                    aria-label="Adicionar novo item"
                    className="p-2 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaPlus className="w-6 h-6" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
