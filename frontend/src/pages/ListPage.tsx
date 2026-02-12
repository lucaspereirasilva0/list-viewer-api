import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCheck, FaPlus, FaTimes, FaRegComment } from "react-icons/fa";
import { Item } from "../api/item";
import ErrorBanner from "../components/ErrorBanner";
import { ItemSkeleton } from "../components/ItemSkeleton";
import { ListItem } from "../components/ListItem";
import {
  useCreateItem,
  useDeleteItem,
  useToggleItem,
  useUpdateItem,
} from "../queries/useItemMutations";
import { useItems } from "../queries/useItems";

export function ListPage() {
  const { data: items, isLoading, error } = useItems();
  const deleteItem = useDeleteItem();
  const toggleItem = useToggleItem();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemObservation, setNewItemObservation] = useState("");
  const [isObservationExpanded, setIsObservationExpanded] = useState(false);
  const contentEditableNewItemRef = useRef<HTMLDivElement>(null);
  const contentEditableObservationRef = useRef<HTMLDivElement>(null);
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

  const [isSubmittingNewItem, setIsSubmittingNewItem] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleCreateSubmit = useCallback(() => {
    // Bloqueio síncrono para evitar race condition entre onBlur e clique no botão
    if (createItem.isPending || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmittingNewItem(true);
    const name = contentEditableNewItemRef.current?.innerText.trim() || "";
    if (!name) {
      setIsSubmittingNewItem(false);
      isSubmittingRef.current = false;
      return;
    }

    // Preparar payload com observation - pegar valor direto do ref
    const payload: { name: string; observation?: string } = { name };

    // Só incluir observation se tiver valor
    const observationValue =
      contentEditableObservationRef.current?.innerText.trim() || "";
    if (observationValue.length > 0) {
      payload.observation = observationValue;
    }

    createItem.mutate(payload, {
      onSuccess: () => {
        setNewItemName("");
        setNewItemObservation("");
        setIsObservationExpanded(false);
        setIsAddingNewItem(false);
        setIsSubmittingNewItem(false);
        isSubmittingRef.current = false;
      },
      onError: () => {
        setIsSubmittingNewItem(false);
        isSubmittingRef.current = false;
      },
    });
  }, [createItem]);

  const handleCancelNewItem = useCallback(() => {
    setIsAddingNewItem(false);
    setNewItemName("");
    setNewItemObservation("");
    setIsObservationExpanded(false);
    setIsSubmittingNewItem(false);
    isSubmittingRef.current = false;
  }, []);

  const handleEdit = useCallback((item: Item) => {
    setEditingItemId(item.id);
  }, []);

  const handleSaveEdit = useCallback(
    (item: Item) => {
      if (!item.name.trim()) return;
      updateItem.mutate(
        { ...item, name: item.name.trim() },
        {
          onSuccess: () => {
            setEditingItemId(null);
          },
        },
      );
    },
    [updateItem],
  );

  const handleCancelEdit = useCallback(() => {
    setEditingItemId(null);
  }, []);

  const handleToggle = useCallback(
    (item: Item) => {
      toggleItem.mutate({ ...item, active: !item.active });
    },
    [toggleItem],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteItem.mutate(id);
    },
    [deleteItem],
  );

  const sortedItems = useMemo(() => {
    if (!items) return undefined;
    return [...items].sort((a, b) => {
      // Primary sort by active status (true first)
      const activeComparison = (b.active ? 1 : 0) - (a.active ? 1 : 0);
      if (activeComparison !== 0) {
        return activeComparison;
      }
      // Secondary sort by updatedAt (descending)
      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    });
  }, [items]);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mr-2">
          Sua Lista de Compras
        </h1>
        <div className="flex items-center">
          {!isAddingNewItem ? (
            <button
              onClick={() => setIsAddingNewItem(true)}
              aria-label="Adicionar novo item"
              className="p-2 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              <FaPlus className="w-6 h-6" />
            </button>
          ) : null}
        </div>
      </div>

      {isAddingNewItem && (
        <div className="relative w-full bg-white shadow-md rounded-lg p-4 transition-all duration-200 ease-in-out hover:shadow-lg mb-3">
          {/* Campo Nome */}
          <div className="flex items-center mb-2">
            <div
              ref={contentEditableNewItemRef}
              className={`flex-1 text-lg font-medium outline-none ${
                isSubmittingNewItem ? "text-gray-400" : "text-gray-900"
              }`}
              contentEditable={!isSubmittingNewItem}
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
                // Usa o ref síncrono para evitar race condition
                if (createItem.isPending || isSubmittingRef.current) return;

                // Verifica se o blur foi causado por clique em elementos específicos
                // O relatedTarget é o elemento que recebeu o foco
                const relatedTarget = e.relatedTarget as HTMLElement;

                // Não submete se clicou no botão cancelar, no campo de observação ou no botão de alternar observação
                const isCancelButtonClicked = relatedTarget?.closest(
                  'button[aria-label="Cancelar adição de item"]',
                );
                const isObservationField = relatedTarget?.closest(
                  '[contenteditable="true"]',
                );
                const isObservationToggle = relatedTarget?.closest(
                  'button[aria-label="Alternar campo de observação"]',
                );

                if (
                  isCancelButtonClicked ||
                  isObservationField ||
                  isObservationToggle
                ) {
                  // Se clicou em qualquer um desses elementos, não submete automaticamente
                  return;
                }

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
          </div>

          {/* Campo Observation Expandível */}
          <div className="mb-2">
            <button
              onClick={() => setIsObservationExpanded(!isObservationExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-1"
              aria-label="Alternar campo de observação"
            >
              <FaRegComment />
              {isObservationExpanded
                ? "Ocultar observação"
                : "Adicionar observação"}
            </button>

            {isObservationExpanded && (
              <div className="relative">
                <div
                  ref={contentEditableObservationRef}
                  className="w-full min-h-[60px] p-2 border border-gray-300 rounded-md text-sm text-gray-900 outline-none focus:border-blue-500"
                  contentEditable={!isSubmittingNewItem}
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    const text = e.currentTarget.innerText;
                    // Limitar a 200 caracteres sem atualizar estado
                    if (text.length > 200) {
                      e.currentTarget.innerText = text.slice(0, 200);
                      // Mover cursor para o final
                      const range = document.createRange();
                      const selection = window.getSelection();
                      range.selectNodeContents(e.currentTarget);
                      range.collapse(false);
                      selection?.removeAllRanges();
                      selection?.addRange(range);
                    }
                  }}
                  onBlur={(e) => {
                    // Usa o ref síncrono para evitar race condition
                    if (createItem.isPending || isSubmittingRef.current) return;

                    // Verifica se o blur foi causado por clique no botão cancelar ou adicionar
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    const isCancelButtonClicked = relatedTarget?.closest(
                      'button[aria-label="Cancelar adição de item"]',
                    );
                    const isAddButtonClicked = relatedTarget?.closest(
                      'button[aria-label="Adicionar item"]',
                    );

                    // Se clicou nos botões, não faz nada (eles vão tratar a ação)
                    if (isCancelButtonClicked || isAddButtonClicked) {
                      return;
                    }

                    // Se saiu do campo de observação, submete o formulário
                    const name =
                      contentEditableNewItemRef.current?.innerText.trim() || "";
                    if (name) {
                      handleCreateSubmit();
                    }
                  }}
                >
                  {newItemObservation}
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {newItemObservation.length}/200 caracteres
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center flex-wrap justify-end gap-2">
            <button
              onClick={handleCreateSubmit}
              disabled={isSubmittingNewItem}
              aria-label="Adicionar item"
              className={`p-1 text-white rounded-md font-semibold transition-colors duration-200 text-sm ${
                isSubmittingNewItem
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <FaCheck className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelNewItem}
              disabled={isSubmittingNewItem}
              aria-label="Cancelar adição de item"
              className={`p-1 text-white rounded-md font-semibold transition-colors duration-200 text-sm ${
                isSubmittingNewItem
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
          {(!sortedItems || sortedItems.length === 0) && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] px-4">
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
            </div>
          )}

          {sortedItems && sortedItems.length > 0 && (
            <ul className="space-y-3">
              {sortedItems.map((item) => (
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
          )}
        </>
      )}
    </div>
  );
}
