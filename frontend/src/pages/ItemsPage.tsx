import { useState } from "react";
import { useCreateItem } from "../queries/useItemMutations";

function ItemsPage() {
  const createItem = useCreateItem();

  const [newName, setNewName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createItem.mutate({ name: newName.trim() });
    setNewName("");
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">Adicionar Novo Item</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm bg-white !text-gray-900 placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Nome do item…"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          disabled={createItem.isPending}
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}

export default ItemsPage;
