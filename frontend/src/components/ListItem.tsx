import { Item } from "../api/item";
import { useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaRegCircle,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
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

export function ListItem({
  item,
  editingItemId,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
}: ListItemProps) {
  const contentEditableRef = useRef<HTMLDivElement>(null);

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
      className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 transition-all duration-200 ease-in-out hover:shadow-lg"
    >
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
          </>
        )}
      </div>
    </li>
  );
}
