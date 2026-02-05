import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListItem } from "../ListItem";
import { Item } from "../../api/item";

const mockItem: Item = {
  id: "1",
  name: "Test Item",
  active: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("ListItem", () => {
  it("deve renderizar o nome do item", () => {
    render(
      <ListItem
        item={mockItem}
        editingItemId={null}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("deve mostrar botão de toggle quando não está editando", () => {
    render(
      <ListItem
        item={mockItem}
        editingItemId={null}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Desmarcar item")).toBeInTheDocument();
  });

  it("deve mostrar botões de edição e exclusão", () => {
    render(
      <ListItem
        item={mockItem}
        editingItemId={null}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Editar item")).toBeInTheDocument();
    expect(screen.getByLabelText("Excluir item")).toBeInTheDocument();
  });

  it("deve aplicar estilo de line-through quando item está inativo", () => {
    const inactiveItem = { ...mockItem, active: false };

    render(
      <ListItem
        item={inactiveItem}
        editingItemId={null}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onSaveEdit={vi.fn()}
        onCancelEdit={vi.fn()}
      />,
    );

    const itemText = screen.getByText("Test Item");
    expect(itemText).toHaveClass("line-through");
  });
});
