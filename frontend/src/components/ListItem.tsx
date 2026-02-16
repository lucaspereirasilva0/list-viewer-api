import { Item } from "../api/item";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaRegCircle,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaRegComment,
} from "react-icons/fa";

interface ListItemProps {
  item: Item;
  editingItemId: string | null;
  onToggle: (item: Item) => void;
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
  onSaveEdit: (item: Item) => void;
  onCancelEdit: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const ListItem = React.memo(function ListItem({
  item,
  editingItemId,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  style,
  className,
}: ListItemProps) {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const observationRef = useRef<HTMLDivElement>(null);
  const [isObservationExpanded, setIsObservationExpanded] = useState(false);
  const [editedObservation, setEditedObservation] = useState(
    item.observation || "",
  );

  // Resetar o estado da observação quando o item mudar
  useEffect(() => {
    setEditedObservation(item.observation || "");
  }, [item.observation, item.id]);

  useEffect(() => {
    if (editingItemId === item.id && contentEditableRef.current) {
      contentEditableRef.current.focus();
      // Place cursor at the end of the text
      const range = document.createRange();
      const selection = window.getSelection();
      if (contentEditableRef.current.firstChild) {
        range.setStart(
          contentEditableRef.current.firstChild,
          contentEditableRef.current.firstChild.nodeValue?.length || 0,
        );
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [editingItemId, item.id]);

  return (
    <li
      style={style}
      className={`flex flex-col bg-white/90 dark:bg-surface-elevated-dark/95 backdrop-blur-sm shadow-soft dark:shadow-soft-dark rounded-soft p-5 transition-all duration-200 ease-out hover:shadow-elegant dark:hover:shadow-elegant-dark hover:-translate-y-0.5 border-double-editorial ${className || ""}`}
    >
      {/* Linha principal: Nome + Ações */}
      <div className="flex items-center justify-between">
        <div
          ref={contentEditableRef}
          className={`flex-1 text-lg font-display tracking-editorial transition-opacity duration-200 ${
            item.active
              ? "text-charcoal dark:text-text-dark"
              : "text-muted dark:text-muted-dark line-through opacity-60"
          }`}
          contentEditable={editingItemId === item.id}
          suppressContentEditableWarning={true}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const newName = e.currentTarget.innerText.trim();
              if (newName) {
                onSaveEdit({ ...item, name: newName });
              } else {
                onCancelEdit();
              }
            }
            if (e.key === "Escape") {
              e.preventDefault();
              onCancelEdit();
            }
          }}
          onBlur={(e) => {
            // Verificar se o blur foi causado por clique no campo de observação ou botão de alternar
            const relatedTarget = e.relatedTarget as HTMLElement;
            const isObservationField = relatedTarget?.closest(
              '[contenteditable="true"]',
            );
            const isObservationToggle = relatedTarget?.closest(
              'button[aria-label="Alternar exibição da observação"]',
            );

            // Se clicou no campo de observação ou no botão de alternar, não fecha a edição
            if (isObservationField || isObservationToggle) {
              return;
            }

            const newName = e.currentTarget.innerText.trim();
            if (newName) {
              onSaveEdit({ ...item, name: newName });
            } else {
              onCancelEdit();
            }
          }}
        >
          {item.name}
        </div>
        <div className="flex items-center flex-wrap justify-end gap-2 ml-3">
          {editingItemId === item.id ? (
            <>
              <button
                onClick={() => onSaveEdit(item)}
                aria-label="Salvar edição"
                className="p-2 bg-primary text-white rounded-soft font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-soft dark:hover:bg-opacity-90"
              >
                <FaCheck className="w-5 h-5" />
              </button>
              <button
                onClick={onCancelEdit}
                aria-label="Cancelar edição"
                className="p-2 bg-muted text-white rounded-soft font-semibold transition-all duration-200 ease-out hover:bg-accent hover:scale-[1.02] hover:shadow-soft"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onToggle(item)}
                aria-pressed={item.active}
                aria-label={item.active ? "Desmarcar item" : "Marcar item"}
                className={`p-2 rounded-soft font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-soft ${
                  item.active
                    ? "bg-primary text-white dark:hover:bg-opacity-90"
                    : "bg-muted/40 text-charcoal dark:text-text-dark hover:bg-accent/20"
                }`}
              >
                {item.active ? (
                  <FaCheckCircle className="w-5 h-5" />
                ) : (
                  <FaRegCircle className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => onEdit(item)}
                aria-label="Editar item"
                className="p-2 bg-accent text-white rounded-soft font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-soft"
              >
                <FaEdit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                aria-label="Excluir item"
                className="p-2 bg-red-600 text-white rounded-soft font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-soft"
              >
                <FaTrash className="w-5 h-5" />
              </button>
              {/* Botão de toggle de observação - só aparece quando tem observação e não está editando */}
              {item.observation && item.observation.length > 0 && (
                <button
                  onClick={() =>
                    setIsObservationExpanded(!isObservationExpanded)
                  }
                  aria-label="Alternar exibição da observação"
                  aria-expanded={isObservationExpanded}
                  className={`p-2 rounded-soft font-semibold transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-soft ${
                    isObservationExpanded
                      ? "bg-primary text-white dark:hover:bg-opacity-90"
                      : "bg-muted/40 text-charcoal dark:text-text-dark hover:bg-accent/20"
                  }`}
                >
                  <FaRegComment className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Seção de edição da observação - só aparece durante edição */}
      {editingItemId === item.id && (
        <div className="mt-3 border-t border-accent/10 dark:border-border-dark pt-3">
          <label className="block text-sm font-display font-medium text-charcoal dark:text-text-dark mb-2 tracking-editorial">
            Observação (opcional)
          </label>
          <div
            ref={observationRef}
            className="outline-none min-h-[60px] p-3 border border-accent/20 dark:border-border-dark rounded-soft text-charcoal dark:text-text-dark bg-white/80 dark:bg-surface-elevated-dark/80 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            contentEditable={true}
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
              // Verificar se o blur foi causado por clique no botão de cancelar
              const relatedTarget = e.relatedTarget as HTMLElement;
              const isCancelButton = relatedTarget?.closest(
                'button[aria-label="Cancelar edição"]',
              );

              // Se clicou no botão de cancelar, não salva a observação
              if (isCancelButton) {
                return;
              }

              // Salvar a observação quando sair do campo (exceto ao cancelar)
              const newObservation =
                observationRef.current?.innerText.trim() || "";
              if (newObservation !== item.observation) {
                onSaveEdit({
                  ...item,
                  observation: newObservation || undefined,
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const newObservation =
                  observationRef.current?.innerText.trim() || "";
                onSaveEdit({
                  ...item,
                  observation: newObservation || undefined,
                });
              }
            }}
          >
            {editedObservation}
          </div>
          <div className="text-xs text-muted dark:text-muted-dark mt-1 text-right">
            {editedObservation.length}/200
          </div>
        </div>
      )}

      {/* Painel de visualização da observação - só aparece quando expandido e não está editando */}
      {editingItemId !== item.id &&
        isObservationExpanded &&
        item.observation &&
        item.observation.length > 0 && (
          <div className="mt-3 border-t border-accent/10 dark:border-border-dark pt-3 animate-fade-in">
            <div className="text-sm text-charcoal dark:text-text-dark bg-surface/50 dark:bg-surface-elevated-dark/50 p-3 rounded-soft border border-accent/10 dark:border-border-dark">
              <p className="whitespace-pre-wrap">{item.observation}</p>
              <div className="text-xs text-muted dark:text-muted-dark mt-2 text-right">
                {item.observation.length}/200
              </div>
            </div>
          </div>
        )}
    </li>
  );
});
