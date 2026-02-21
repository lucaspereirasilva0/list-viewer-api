import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCheck, FaPlus, FaTimes, FaRegComment } from "react-icons/fa";
import { Item } from "../api/item";
import ErrorBanner from "../components/ErrorBanner";
import { ItemSkeleton } from "../components/ItemSkeleton";
import { ListItem } from "../components/ListItem";
import { ThemeToggle } from "../providers/ThemeToggle";
import { ToggleAllButton } from "../components/ToggleAllButton";
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

  useEffect(() => {
    if (isObservationExpanded && contentEditableObservationRef.current) {
      setTimeout(() => {
        if (contentEditableObservationRef.current) {
          contentEditableObservationRef.current.focus();
          const range = document.createRange();
          const selection = window.getSelection();

          // Ensure there's a text node to set the cursor on
          if (!contentEditableObservationRef.current.firstChild) {
            contentEditableObservationRef.current.appendChild(
              document.createTextNode(""),
            );
          }

          range.setStart(
            contentEditableObservationRef.current.firstChild,
            contentEditableObservationRef.current.firstChild.nodeValue
              ?.length || 0,
          );
          range.collapse(true); // Collapse to the end

          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0); // Small delay to allow DOM to update
    }
  }, [isObservationExpanded]);

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
      <header className="flex items-center justify-center mb-8 pb-6 border-b border-accent/10 dark:border-border-dark">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-charcoal dark:text-text-dark tracking-editorial mr-4">
          Sua Lista de Compras
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Botão ToggleAll - só mostra quando há itens E não está adicionando novo item */}
          {!isAddingNewItem && sortedItems && sortedItems.length > 0 && (
            <ToggleAllButton
              items={sortedItems}
              disabled={createItem.isPending || updateItem.isPending}
            />
          )}
          {!isAddingNewItem ? (
            <button
              onClick={() => setIsAddingNewItem(true)}
              aria-label="Adicionar novo item"
              className="p-3 bg-primary text-white rounded-soft shadow-soft hover:shadow-elegant hover:scale-[1.02] transition-all duration-200 ease-out dark:hover:bg-opacity-90"
            >
              <FaPlus className="w-6 h-6" />
            </button>
          ) : null}
        </div>
      </header>

      {isAddingNewItem && (
        <div className="relative w-full bg-white/90 dark:bg-surface-elevated-dark/95 backdrop-blur-sm shadow-soft dark:shadow-soft-dark rounded-soft p-5 transition-all duration-200 ease-out hover:shadow-elegant dark:hover:shadow-elegant-dark mb-4 animate-fade-in border-double-editorial">
          {/* Campo Nome */}
          <div className="flex items-center justify-between mb-3">
            <div
              ref={contentEditableNewItemRef}
              className={`flex-1 text-lg font-display font-medium outline-none ${
                isSubmittingNewItem
                  ? "text-muted dark:text-muted-dark"
                  : "text-charcoal dark:text-text-dark"
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
          <div className="mb-3">
            <button
              onClick={() => setIsObservationExpanded(!isObservationExpanded)}
              className="text-sm font-display text-primary dark:text-primary/90 hover:opacity-80 flex items-center gap-2 mb-2 transition-opacity tracking-editorial"
              aria-label="Alternar campo de observação"
            >
              <FaRegComment />
              {isObservationExpanded
                ? "Ocultar observação"
                : "Adicionar observação"}
            </button>

            {isObservationExpanded && (
              <div className="relative animate-fade-in">
                <div
                  ref={contentEditableObservationRef}
                  className="w-full min-h-[60px] p-3 border border-accent/20 dark:border-border-dark rounded-soft text-sm text-charcoal dark:text-text-dark font-display outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 dark:bg-surface-elevated-dark/80 transition-all duration-200"
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
                <div className="text-xs text-muted dark:text-muted-dark mt-1 text-right">
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
              className={`p-2 text-white rounded-soft font-semibold transition-all duration-200 ease-out ${
                isSubmittingNewItem
                  ? "bg-muted cursor-not-allowed"
                  : "bg-primary hover:scale-[1.02] hover:shadow-soft dark:hover:bg-opacity-90"
              }`}
            >
              <FaCheck className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelNewItem}
              disabled={isSubmittingNewItem}
              aria-label="Cancelar adição de item"
              className={`p-2 text-white rounded-soft font-semibold transition-all duration-200 ease-out ${
                isSubmittingNewItem
                  ? "bg-muted cursor-not-allowed"
                  : "bg-muted hover:bg-accent hover:scale-[1.02] hover:shadow-soft"
              }`}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <ul className="space-y-4 mt-6">
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
              <div className="mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border border-primary/20 rounded-full animate-pulse-soft"></div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  stroke="currentColor"
                  className="w-24 h-24 text-primary relative z-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.023.832l.236 1.626c.092.636.574 1.144 1.206 1.258l7.105 1.185c.677.113 1.238.618 1.458 1.29l1.632 4.903c.237.712-.224 1.453-.94 1.453H9.982a.875.875 0 01-.872-.775l-.277-2.775a.875.875 0 01.872-.975h7.25c.348 0 .638-.282.684-.627l1.01-3.028M2.25 3L.659 6.273M15.75 12h2.25m-11.5 2.25h8.25"
                  />
                </svg>
              </div>

              <p className="text-lg sm:text-xl text-charcoal/70 dark:text-text-dark/70 font-display tracking-editorial mb-2 text-center">
                Sua lista está vazia
              </p>
              <p className="text-sm text-muted dark:text-muted-dark text-center max-w-md">
                Adicione itens à sua lista de compras usando o botão acima
              </p>
            </div>
          )}

          {sortedItems && sortedItems.length > 0 && (
            <ul className="space-y-4 mt-6">
              {sortedItems.map((item, index) => (
                <ListItem
                  key={item.id}
                  item={item}
                  editingItemId={editingItemId}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in"
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
