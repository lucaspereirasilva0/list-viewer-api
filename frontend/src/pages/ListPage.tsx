import { useItems } from "../queries/useItems";
import { useDeleteItem, useToggleItem } from "../queries/useItemMutations";
import { Item } from "../api/item";

export function ListPage() {
  const { data: items, isLoading, error } = useItems();
  const deleteItem = useDeleteItem();
  const toggleItem = useToggleItem();

  if (isLoading) {
    return (
      <div className="text-center text-lg text-gray-500">
        Carregando itens...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-500">
        Erro ao carregar itens: {error.message}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-lg text-gray-500">
        Nenhum item na lista.
      </div>
    );
  }

  const handleToggle = (item: Item) => {
    toggleItem.mutate({ ...item, active: !item.active });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-400">
        Sua Lista de Compras
      </h1>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 transition-all duration-200 ease-in-out hover:shadow-lg"
          >
            <div
              className={`flex-1 text-lg font-medium ${
                item.active ? "text-gray-900" : "text-gray-500 line-through"
              }`}
            >
              {item.name}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleToggle(item)}
                className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
                  item.active
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {item.active ? "Desmarcar" : "Marcar"}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
