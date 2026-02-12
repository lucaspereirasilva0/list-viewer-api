import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  describe("Campo de Observação", () => {
    it("Given_ItemWithObservation_When_Rendering_Then_ShowsObservationButton", () => {
      const itemWithObs = {
        ...mockItem,
        observation: "Observação de teste",
      };

      render(
        <ListItem
          item={itemWithObs}
          editingItemId={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
          onSaveEdit={vi.fn()}
          onCancelEdit={vi.fn()}
        />,
      );

      expect(
        screen.getByLabelText("Alternar exibição da observação"),
      ).toBeInTheDocument();
    });

    it("Given_ItemWithoutObservation_When_Rendering_Then_DoesNotShowObservationButton", () => {
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

      expect(
        screen.queryByLabelText("Alternar exibição da observação"),
      ).not.toBeInTheDocument();
    });

    it("Given_ObservationExpanded_When_ClickingButton_Then_TogglesDisplay", () => {
      const itemWithObs = {
        ...mockItem,
        observation: "Observação de teste",
      };

      render(
        <ListItem
          item={itemWithObs}
          editingItemId={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
          onSaveEdit={vi.fn()}
          onCancelEdit={vi.fn()}
        />,
      );

      const button = screen.getByLabelText("Alternar exibição da observação");

      // Inicialmente a observação não está visível
      expect(screen.queryByText("Observação de teste")).not.toBeInTheDocument();

      // Clicar para expandir
      fireEvent.click(button);

      // Agora a observação deve estar visível
      expect(screen.getByText("Observação de teste")).toBeInTheDocument();

      // Clicar novamente para colapsar
      fireEvent.click(button);

      // Observação não deve estar mais visível
      expect(screen.queryByText("Observação de teste")).not.toBeInTheDocument();
    });

    it("Given_ItemWithObservation_When_Rendering_Then_ShowsCharacterCount", () => {
      const itemWithObs = {
        ...mockItem,
        observation: "Observação de teste",
      };

      render(
        <ListItem
          item={itemWithObs}
          editingItemId={null}
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
          onSaveEdit={vi.fn()}
          onCancelEdit={vi.fn()}
        />,
      );

      const button = screen.getByLabelText("Alternar exibição da observação");
      fireEvent.click(button);

      expect(screen.getByText("19/200")).toBeInTheDocument();
    });
  });
});
