export interface Item {
  id: string;
  name: string;
  active: boolean;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function listItems(): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}/items`);
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido ao listar itens" }));
    throw new Error(errorData.message || "Erro ao listar itens");
  }
  return res.json();
}

export async function createItem(data: { name: string }): Promise<Item> {
  const res = await fetch(`${BASE_URL}/item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: data.name, active: true }),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido ao criar item" }));
    throw new Error(errorData.message || "Erro ao criar item");
  }
  return res.json();
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/item?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido ao remover item" }));
    throw new Error(errorData.message || "Erro ao remover item");
  }
}

export async function toggleItem(item: Item): Promise<Item> {
  const res = await fetch(`${BASE_URL}/item`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido ao atualizar item" }));
    throw new Error(errorData.message || "Erro ao atualizar item");
  }
  return res.json();
}
