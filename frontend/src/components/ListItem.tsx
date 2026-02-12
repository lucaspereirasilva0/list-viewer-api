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
}

export const ListItem = React.memo(function ListItem({
  item,
  editingItemId,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
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
      key={item.id}
      className="flex flex-col bg-white shadow-md rounded-lg p-4 transition-all duration-200 ease-in-out hover:shadow-lg"
    >
      {/* Linha principal: Nome + Ações */}
      <div className="flex items-center justify-between">
        <div
          ref={contentEditableRef}
          className={`flex-1 text-lg font-medium ${
            item.active ? "text-gray-900" : "text-gray-500 line-through"
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
        <div className="flex items-center flex-wrap justify-end gap-2">
          {editingItemId === item.id ? (
            <>
              <button
                onClick={() => onSaveEdit(item)}
                aria-label="Salvar edição"
                className="p-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                <FaCheck className="w-5 h-5" />
              </button>
              <button
                onClick={onCancelEdit}
                aria-label="Cancelar edição"
                className="p-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-colors duration-200"
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
                className={`p-2 rounded-md text-white font-semibold transition-colors duration-200 ${item.active ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
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
                className="p-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                <FaEdit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                aria-label="Excluir item"
                className="p-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors duration-200"
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
                  className={`p-2 rounded-md font-semibold transition-colors duration-200 ${
                    isObservationExpanded
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-600"
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
        <div className="mt-3 border-t border-gray-200 pt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observação (opcional)
          </label>
          <div
            ref={observationRef}
            className="outline-none min-h-[60px] p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="text-xs text-gray-400 mt-1 text-right">
            {editedObservation.length}/200
          </div>
        </div>
      )}

      {/* Painel de visualização da observação - só aparece quando expandido e não está editando */}
      {editingItemId !== item.id &&
        isObservationExpanded &&
        item.observation &&
        item.observation.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <p className="whitespace-pre-wrap">{item.observation}</p>
              <div className="text-xs text-gray-400 mt-2 text-right">
                {item.observation.length}/200
              </div>
            </div>
          </div>
        )}
    </li>
  );
});
