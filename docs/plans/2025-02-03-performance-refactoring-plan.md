# Performance & Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement performance improvements and refactoring in the frontend of the shopping list application, following TDD, DRY, and YAGNI principles.

**Architecture:** Incremental refactoring focused on React optimizations (useMemo, useCallback, React.memo), API configuration centralization, and UX improvements. Each change is isolated and testable.

**Tech Stack:** React 18, TypeScript, Vite, React Query (@tanstack/react-query), Tailwind CSS

---

## Prerequisites

Before starting, ensure you:

1. Have the development environment configured
2. Have tests configured (Vitest + React Testing Library) - see unit test task
3. Be on the `feature/performance-refactoring` branch (or create new branch)

```bash
# Create branch if it doesn't exist
git checkout -b feature/performance-refactoring
```

---

# PART 1: HIGH PRIORITY

## Task 1: Optimize `sortedItems` with `useMemo`

**Files:**
- Modify: `frontend/src/pages/ListPage.tsx:97-105`

**Problem:** The sorting is recalculated on every render, causing unnecessary processing.

**Step 1: Add useMemo import**

On line 1, add `useMemo` to the existing imports:

```typescript
import { useEffect, useMemo, useRef, useState } from "react";
```

**Step 2: Wrap sortedItems with useMemo**

Replace lines 97-105 with:

```typescript
const sortedItems = useMemo(() => {
  return items?.sort((a, b) => {
    // Primary sort by active status (true first)
    const activeComparison = (b.active ? 1 : 0) - (a.active ? 1 : 0);
    if (activeComparison !== 0) {
      return activeComparison;
    }
    // Secondary sort by updatedAt (descending)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}, [items]);
```

**Step 3: Test manually**

Run: `npm run dev`

Expected: Application works normally, but sorting is not recalculated on unnecessary renders.

**Step 4: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "perf: optimize sortedItems with useMemo"
```

---

## Task 2: Add max-width to main container

**Files:**
- Modify: `frontend/src/pages/ListPage.tsx:108`

**Problem:** On large screens, the list becomes too wide, harming UX.

**Step 1: Add max-w-2xl to container**

Replace line 108:

```typescript
<div className="container mx-auto p-4 max-w-2xl">
```

**Step 2: Test manually**

Run: `npm run dev`

Expected: On wide screens, the content has a maximum width of 672px (2xl).

**Step 3: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "ux: add max-width to main container"
```

---

## Task 3: Remove `h-screen` from empty state

**Files:**
- Modify: `frontend/src/pages/ListPage.tsx:187`

**Problem:** Creates unnecessary scroll when there are items in the list.

**Step 1: Replace h-screen with min-h-[50vh]

Replace line 187:

```typescript
<div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
```

**Step 2: Test manually**

Run: `npm run dev`

Expected: Empty state has a minimum height of 50vh, without excessive scroll.

**Step 3: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "ux: remove h-screen from empty state to avoid excessive scroll"
```

---

## Task 4: Use `useCallback` in event handlers

**Files:**
- Modify: `frontend/src/pages/ListPage.tsx:1,50-95`

**Problem:** Handlers are recreated on every render, potentially causing unnecessary re-renders in child components.

**Step 1: Add useCallback to imports**

Replace line 1:

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
```

**Step 2: Wrap handleCreateSubmit with useCallback**

Replace lines 50-62 with:

```typescript
const handleCreateSubmit = useCallback(() => {
  const name = contentEditableNewItemRef.current?.innerText.trim() || "";
  if (!name) return;
  createItem.mutate(
    { name: name },
    {
      onSuccess: () => {
        setNewItemName("");
        setIsAddingNewItem(false);
      },
    },
  );
}, [createItem]);
```

**Step 3: Wrap handleCancelNewItem with useCallback**

Replace lines 64-67 with:

```typescript
const handleCancelNewItem = useCallback(() => {
  setIsAddingNewItem(false);
  setNewItemName("");
}, []);
```

**Step 4: Wrap handleEdit with useCallback**

Replace lines 69-71 with:

```typescript
const handleEdit = useCallback((item: Item) => {
  setEditingItemId(item.id);
}, []);
```

**Step 5: Wrap handleSaveEdit with useCallback**

Replace lines 73-83 with:

```typescript
const handleSaveEdit = useCallback((item: Item) => {
  if (!item.name.trim()) return;
  updateItem.mutate(
    { ...item, name: item.name.trim() },
    {
      onSuccess: () => {
        setEditingItemId(null);
      },
    },
  );
}, [updateItem]);
```

**Step 6: Wrap handleCancelEdit with useCallback**

Replace lines 85-87 with:

```typescript
const handleCancelEdit = useCallback(() => {
  setEditingItemId(null);
}, []);
```

**Step 7: Wrap handleToggle with useCallback**

Replace lines 89-91 with:

```typescript
const handleToggle = useCallback((item: Item) => {
  toggleItem.mutate({ ...item, active: !item.active });
}, [toggleItem]);
```

**Step 8: Wrap handleDelete with useCallback**

Replace lines 93-95 with:

```typescript
const handleDelete = useCallback((id: string) => {
  deleteItem.mutate(id);
}, [deleteItem]);
```

**Step 9: Test manually**

Run: `npm run dev`

Expected: Application works normally, but handlers are not recreated on each render.

**Step 10: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "perf: wrap handlers with useCallback to avoid recreation"
```

---

# PART 2: MEDIUM PRIORITY

## Task 5: Unify `toggleItem` and `updateItem` in the API

**Files:**
- Modify: `frontend/src/api/item.ts:59-93`
- Modify: `frontend/src/queries/useItemMutations.ts:2-8,71-98`

**Problem:** The functions `toggleItem` and `updateItem` are identical.

**Step 1: Remove toggleItem from API**

In file `frontend/src/api/item.ts`, remove lines 59-75 (toggleItem function).

**Step 2: Update imports in useItemMutations**

In file `frontend/src/queries/useItemMutations.ts`, replace lines 2-8:

```typescript
import {
  createItem,
  deleteItem,
  Item,
  updateItem,
} from "../api/item";
```

**Step 3: Update useToggleItem to use updateItem**

In file `frontend/src/queries/useItemMutations.ts`, replace line 74 (mutationFn):

```typescript
mutationFn: updateItem,
```

**Step 4: Test manually**

Run: `npm run dev`

Expected: Toggle functionality continues to work, but using updateItem.

**Step 5: Commit**

```bash
git add frontend/src/api/item.ts frontend/src/queries/useItemMutations.ts
git commit -m "refactor: remove duplicated toggleItem, use updateItem"
```

---

## Task 6: Extract ngrok header to centralized configuration

**Files:**
- Create: `frontend/src/api/client.ts`
- Modify: `frontend/src/api/item.ts`

**Problem:** Header `ngrok-skip-browser-warning` hardcoded in multiple calls.

**Step 1: Create configured HTTP client**

Create file `frontend/src/api/client.ts`:

```typescript
const API_CLIENT = {
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
};

export async function apiRequest(url: string, options?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: { ...API_CLIENT.headers, ...options?.headers },
  });
}
```

**Step 2: Update imports in item.ts**

On line 9 of `frontend/src/api/item.ts`, add after the BASE_URL line:

```typescript
import { apiRequest } from "./client";
```

**Step 3: Replace fetch with apiRequest in listItems**

Replace lines 11-16 in `frontend/src/api/item.ts`:

```typescript
export async function listItems(): Promise<Item[]> {
  const res = await apiRequest(`${BASE_URL}/items`);
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido ao listar itens" }));
    throw new Error(errorData.message || "Erro ao listar itens");
  }
  return res.json();
}
```

**Step 4: Replace fetch with apiRequest in createItem**

Replace lines 26-34 in `frontend/src/api/item.ts`:

```typescript
export async function createItem(data: { name: string }): Promise<Item> {
  const res = await apiRequest(`${BASE_URL}/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
```

**Step 5: Replace fetch with apiRequest in deleteItem**

Replace lines 44-50 in `frontend/src/api/item.ts`:

```typescript
export async function deleteItem(id: string): Promise<void> {
  const res = await apiRequest(`${BASE_URL}/item?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido ao remover item" }));
    throw new Error(errorData.message || "Erro ao remover item");
  }
}
```

**Step 6: Replace fetch with apiRequest in updateItem**

Replace lines 77-85 in `frontend/src/api/item.ts`:

```typescript
export async function updateItem(item: Item): Promise<Item> {
  const res = await apiRequest(`${BASE_URL}/item`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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
```

**Step 7: Test manually**

Run: `npm run dev`

Expected: All API calls work with the ngrok header applied automatically.

**Step 8: Commit**

```bash
git add frontend/src/api/client.ts frontend/src/api/item.ts
git commit -m "refactor: centralize HTTP configuration and ngrok header"
```

---

## Task 7: Add `React.memo` to `ListItem`

**Files:**
- Modify: `frontend/src/components/ListItem.tsx:1,22-139`

**Problem:** Component re-renders when other items change.

**Step 1: Add React to imports**

Replace line 1 of `frontend/src/components/ListItem.tsx`:

```typescript
import React, { useEffect, useRef } from "react";
```

**Step 2: Wrap component with React.memo**

Replace lines 22-139 (component declaration) with:

```typescript
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
});
```

**Step 3: Test manually**

Run: `npm run dev`

Expected: Component works normally, but doesn't re-render when other items change.

**Step 4: Commit**

```bash
git add frontend/src/components/ListItem.tsx
git commit -m "perf: add React.memo to ListItem to avoid unnecessary re-renders"
```

---

## Task 8: Improve keyboard navigation

**Files:**
- Modify: `frontend/src/pages/ListPage.tsx`
- Modify: `frontend/src/components/ListItem.tsx`

**Problem:** Lacks adequate keyboard navigation support.

**Step 1: Create custom hook useKeyboardNavigation**

Create file `frontend/src/hooks/useKeyboardNavigation.ts`:

```typescript
import { useEffect } from "react";

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  isEnabled?: boolean;
}

export function useKeyboardNavigation(
  options: KeyboardNavigationOptions,
  dependencies: any[] = []
) {
  const { onEnter, onEscape, onTab, isEnabled = true } = options;

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          onEnter?.();
          break;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          break;
        case "Tab":
          e.preventDefault();
          onTab?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, onEscape, onTab, isEnabled, ...dependencies]);
}
```

**Step 2: Test manually**

Run: `npm run dev`

Expected: Keyboard navigation works consistently throughout the application.

**Step 3: Commit**

```bash
git add frontend/src/hooks/useKeyboardNavigation.ts
git commit -m "feat: add useKeyboardNavigation hook to improve accessibility"
```

---

# PART 3: LOW PRIORITY

## Task 9: Color contrast analysis

**Files:**
- Documentation: `docs/accessibility/contrast-analysis.md`

**Step 1: Create accessibility documentation directory**

```bash
mkdir -p docs/accessibility
```

**Step 2: Create contrast analysis document**

Create file `docs/accessibility/contrast-analysis.md`:

```markdown
# Color Contrast Analysis

## Current Colors

### Light Mode
- Primary text: `text-gray-900` (#111827) - AA+ with white background
- Secondary text: `text-gray-500` (#6B7280) - AA with white background
- Green button: `bg-green-600` (#16A34A) - AA+ with white text
- Blue button: `bg-blue-600` (#2563EB) - AA+ with white text
- Yellow button: `bg-yellow-600` (#CA8A04) - AA with white text
- Red button: `bg-red-600` (#DC2626) - AA+ with white text

### Dark Mode
- Primary text: `dark:text-gray-100` (#F3F4F6) - AA+ with dark background
- Secondary text: `dark:text-gray-300` (#D1D5DB) - AA+ with dark background

## Recommendations

All current colors meet WCAG AA standards. To improve to AAA:

1. Consider increasing the contrast of the yellow button to `bg-yellow-700`
2. Add visual indicators beyond color (icons, text)

## Validation Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/)
```

**Step 3: Commit**

```bash
git add docs/accessibility/contrast-analysis.md
git commit -m "docs: add color contrast analysis for accessibility"
```

---

## Task 10: Unit and integration tests

**Files:**
- Create: `frontend/src/components/__tests__/ListItem.test.tsx`
- Create: `frontend/src/pages/__tests__/ListPage.test.tsx`
- Create: `frontend/src/api/__tests__/item.test.ts`

**Prerequisites:** Configure Vitest and React Testing Library if not yet configured.

**Step 1: Verify if Vitest is configured**

Check `frontend/vite.config.ts` and `frontend/package.json` for test dependencies.

**Step 2: Create test for ListItem**

Create file `frontend/src/components/__tests__/ListItem.test.tsx`:

```typescript
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
      />
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
      />
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
      />
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
      />
    );

    const itemText = screen.getByText("Test Item");
    expect(itemText).toHaveClass("line-through");
  });
});
```

**Step 3: Create test for API client**

Create file `frontend/src/api/__tests__/client.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiRequest } from "../client";

global.fetch = vi.fn();

describe("apiRequest", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("deve adicionar header ngrok-skip-browser-warning", async () => {
    const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest("http://test.com");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://test.com",
      expect.objectContaining({
        headers: expect.objectContaining({
          "ngrok-skip-browser-warning": "true",
        }),
      })
    );
  });

  it("deve mesclar headers personalizados", async () => {
    const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiRequest("http://test.com", {
      headers: { "Content-Type": "application/json" },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://test.com",
      expect.objectContaining({
        headers: expect.objectContaining({
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        }),
      })
    );
  });
});
```

**Step 4: Run tests**

Run: `npm run test`

Expected: All tests pass.

**Step 5: Commit**

```bash
git add frontend/src/components/__tests__/ frontend/src/api/__tests__/
git commit -m "test: add unit tests for ListItem and apiRequest"
```

---

# FINALIZATION

## Task 11: Cleanup and Documentation

**Step 1: Update next-steps.md**

Mark completed items in file `memory-bank/next-steps.md`.

**Step 2: Create ADR for performance changes**

If necessary, create ADR documenting optimization decisions.

**Step 3: Final commit**

```bash
git add memory-bank/next-steps.md docs/adr/
git commit -m "docs: update documentation with implemented improvements"
```

---

# Verification Checklist

Before considering the plan complete:

- [ ] Task 1: useMemo in sortedItems
- [ ] Task 2: max-w-2xl in container
- [ ] Task 3: Remove h-screen from empty state
- [ ] Task 4: useCallback in handlers
- [ ] Task 5: Unify toggleItem and updateItem
- [ ] Task 6: Centralize HTTP configuration
- [ ] Task 7: React.memo in ListItem
- [ ] Task 8: useKeyboardNavigation hook
- [ ] Task 9: Contrast analysis
- [ ] Task 10: Unit tests
- [ ] Task 11: Updated documentation

---

# Important Notes

1. **TDD:** Always write tests before implementing (when applicable)
2. **Frequent commits:** Each task should have its own commit
3. **Manual testing:** After each change, test the application manually
4. **YAGNI:** Do not add extra unsolicited features
5. **DRY:** Reuse existing code whenever possible

---

## References

- Original documentation: `memory-bank/next-steps.md`
- Existing ADRs: `docs/adr/`
- Current code: `frontend/src/`
