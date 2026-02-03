# Performance & Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar melhorias de performance e refatoração no frontend da aplicação de lista de compras, seguindo princípios TDD, DRY e YAGNI.

**Architecture:** Refatoração incremental focada em otimizações de React (useMemo, useCallback, React.memo), centralização de configuração da API e melhorias de UX. Cada mudança é isolada e testável.

**Tech Stack:** React 18, TypeScript, Vite, React Query (@tanstack/react-query), Tailwind CSS

---

## Pré-requisitos

Antes de iniciar, certifique-se de:

1. Ter o ambiente de desenvolvimento configurado
2. Ter os testes configurados (Vitest + React Testing Library) - ver task de teste unitário
3. Estar na branch `feature/performance-refactoring` (ou criar nova branch)

```bash
# Criar branch se não existir
git checkout -b feature/performance-refactoring
```

---

# PARTE 1: ALTA PRIORIDADE

## Task 1: Otimizar `sortedItems` com `useMemo`

**Arquivos:**
- Modificar: `frontend/src/pages/ListPage.tsx:97-105`

**Problema:** O sorting é recalculado em toda renderização, causando processamento desnecessário.

**Passo 1: Adicionar import do useMemo**

Na linha 1, adicionar `useMemo` aos imports existentes:

```typescript
import { useEffect, useMemo, useRef, useState } from "react";
```

**Passo 2: Envolver sortedItems com useMemo**

Substituir as linhas 97-105 por:

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

**Passo 3: Testar manualmente**

Execute: `npm run dev`

Expected: Aplicação funciona normalmente, mas sorting não é recalculado em renders desnecessários.

**Passo 4: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "perf: otimizar sortedItems com useMemo"
```

---

## Task 2: Adicionar largura máxima no container principal

**Arquivos:**
- Modificar: `frontend/src/pages/ListPage.tsx:108`

**Problema:** Em telas grandes, a lista fica muito larga, prejudicando a UX.

**Passo 1: Adicionar max-w-2xl ao container**

Substituir a linha 108:

```typescript
<div className="container mx-auto p-4 max-w-2xl">
```

**Passo 2: Testar manualmente**

Execute: `npm run dev`

Expected: Em telas largas, o conteúdo tem largura máxima de 672px (2xl).

**Passo 3: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "ux: adicionar largura máxima no container principal"
```

---

## Task 3: Remover `h-screen` do empty state

**Arquivos:**
- Modificar: `frontend/src/pages/ListPage.tsx:187`

**Problema:** Cria scroll desnecessário quando há itens na lista.

**Passo 1: Substituir h-screen por min-h-[50vh]**

Substituir a linha 187:

```typescript
<div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
```

**Passo 2: Testar manualmente**

Execute: `npm run dev`

Expected: Empty state tem altura mínima de 50vh, sem scroll excessivo.

**Passo 3: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "ux: remover h-screen do empty state para evitar scroll excessivo"
```

---

## Task 4: Usar `useCallback` nos handlers de eventos

**Arquivos:**
- Modificar: `frontend/src/pages/ListPage.tsx:1,50-95`

**Problema:** Handlers são recriados em toda render, podendo causar re-renders desnecessários em componentes filhos.

**Passo 1: Adicionar useCallback aos imports**

Substituir a linha 1:

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
```

**Passo 2: Envolver handleCreateSubmit com useCallback**

Substituir as linhas 50-62 por:

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

**Passo 3: Envolver handleCancelNewItem com useCallback**

Substituir as linhas 64-67 por:

```typescript
const handleCancelNewItem = useCallback(() => {
  setIsAddingNewItem(false);
  setNewItemName("");
}, []);
```

**Passo 4: Envolver handleEdit com useCallback**

Substituir as linhas 69-71 por:

```typescript
const handleEdit = useCallback((item: Item) => {
  setEditingItemId(item.id);
}, []);
```

**Passo 5: Envolver handleSaveEdit com useCallback**

Substituir as linhas 73-83 por:

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

**Passo 6: Envolver handleCancelEdit com useCallback**

Substituir as linhas 85-87 por:

```typescript
const handleCancelEdit = useCallback(() => {
  setEditingItemId(null);
}, []);
```

**Passo 7: Envolver handleToggle com useCallback**

Substituir as linhas 89-91 por:

```typescript
const handleToggle = useCallback((item: Item) => {
  toggleItem.mutate({ ...item, active: !item.active });
}, [toggleItem]);
```

**Passo 8: Envolver handleDelete com useCallback**

Substituir as linhas 93-95 por:

```typescript
const handleDelete = useCallback((id: string) => {
  deleteItem.mutate(id);
}, [deleteItem]);
```

**Passo 9: Testar manualmente**

Execute: `npm run dev`

Expected: Aplicação funciona normalmente, mas handlers não são recriados em cada render.

**Passo 10: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "perf: envolver handlers com useCallback para evitar recriação"
```

---

# PARTE 2: MÉDIA PRIORIDADE

## Task 5: Unificar `toggleItem` e `updateItem` na API

**Arquivos:**
- Modificar: `frontend/src/api/item.ts:59-93`
- Modificar: `frontend/src/queries/useItemMutations.ts:2-8,71-98`

**Problema:** As funções `toggleItem` e `updateItem` são idênticas.

**Passo 1: Remover toggleItem da API**

No arquivo `frontend/src/api/item.ts`, remover as linhas 59-75 (função toggleItem).

**Passo 2: Atualizar imports no useItemMutations**

No arquivo `frontend/src/queries/useItemMutations.ts`, substituir linha 2-8:

```typescript
import {
  createItem,
  deleteItem,
  Item,
  updateItem,
} from "../api/item";
```

**Passo 3: Atualizar useToggleItem para usar updateItem**

No arquivo `frontend/src/queries/useItemMutations.ts`, substituir linha 74 (mutationFn):

```typescript
mutationFn: updateItem,
```

**Passo 4: Testar manualmente**

Execute: `npm run dev`

Expected: Funcionalidade de toggle continua funcionando, mas usando updateItem.

**Passo 5: Commit**

```bash
git add frontend/src/api/item.ts frontend/src/queries/useItemMutations.ts
git commit -m "refactor: remover toggleItem duplicado, usar updateItem"
```

---

## Task 6: Extrair header ngrok para configuração centralizada

**Arquivos:**
- Criar: `frontend/src/api/client.ts`
- Modificar: `frontend/src/api/item.ts`

**Problema:** Header `ngrok-skip-browser-warning` hardcoded em múltiplas chamadas.

**Passo 1: Criar client HTTP configurado**

Criar arquivo `frontend/src/api/client.ts`:

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

**Passo 2: Atualizar imports no item.ts**

Na linha 9 de `frontend/src/api/item.ts`, adicionar após a linha do BASE_URL:

```typescript
import { apiRequest } from "./client";
```

**Passo 3: Substituir fetch por apiRequest em listItems**

Substituir linhas 11-16 em `frontend/src/api/item.ts`:

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

**Passo 4: Substituir fetch por apiRequest em createItem**

Substituir linhas 26-34 em `frontend/src/api/item.ts`:

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

**Passo 5: Substituir fetch por apiRequest em deleteItem**

Substituir linhas 44-50 em `frontend/src/api/item.ts`:

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

**Passo 6: Substituir fetch por apiRequest em updateItem**

Substituir linhas 77-85 em `frontend/src/api/item.ts`:

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

**Passo 7: Testar manualmente**

Execute: `npm run dev`

Expected: Todas as chamadas de API funcionam com o header ngrok aplicado automaticamente.

**Passo 8: Commit**

```bash
git add frontend/src/api/client.ts frontend/src/api/item.ts
git commit -m "refactor: centralizar configuração HTTP e header ngrok"
```

---

## Task 7: Adicionar `React.memo` no `ListItem`

**Arquivos:**
- Modificar: `frontend/src/components/ListItem.tsx:1,22-139`

**Problema:** Componente re-renderiza quando outros itens mudam.

**Passo 1: Adicionar React aos imports**

Substituir linha 1 de `frontend/src/components/ListItem.tsx`:

```typescript
import React, { useEffect, useRef } from "react";
```

**Passo 2: Envolver componente com React.memo**

Substituir linhas 22-139 (declaração do componente) por:

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

**Passo 3: Testar manualmente**

Execute: `npm run dev`

Expected: Componente funciona normalmente, mas não re-renderiza quando outros itens mudam.

**Passo 4: Commit**

```bash
git add frontend/src/components/ListItem.tsx
git commit -m "perf: adicionar React.memo no ListItem para evitar re-renders desnecessários"
```

---

## Task 8: Melhorar navegação por teclado

**Arquivos:**
- Modificar: `frontend/src/pages/ListPage.tsx`
- Modificar: `frontend/src/components/ListItem.tsx`

**Problema:** Falta suporte adequado para navegação por teclado.

**Passo 1: Criar hook customizado useKeyboardNavigation**

Criar arquivo `frontend/src/hooks/useKeyboardNavigation.ts`:

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

**Passo 2: Testar manualmente**

Execute: `npm run dev`

Expected: Navegação por teclado funciona consistentemente em toda a aplicação.

**Passo 3: Commit**

```bash
git add frontend/src/hooks/useKeyboardNavigation.ts
git commit -m "feat: adicionar hook useKeyboardNavigation para melhorar acessibilidade"
```

---

# PARTE 3: BAIXA PRIORIDADE

## Task 9: Análise de contraste de cores

**Arquivos:**
- Documentação: `docs/accessibility/contrast-analysis.md`

**Passo 1: Criar diretório de documentação de acessibilidade**

```bash
mkdir -p docs/accessibility
```

**Passo 2: Criar documento de análise de contraste**

Criar arquivo `docs/accessibility/contrast-analysis.md`:

```markdown
# Análise de Contraste de Cores

## Cores Atuais

### Modo Claro
- Texto primário: `text-gray-900` (#111827) - AA+ com fundo branco
- Texto secundário: `text-gray-500` (#6B7280) - AA com fundo branco
- Botão verde: `bg-green-600` (#16A34A) - AA+ com texto branco
- Botão azul: `bg-blue-600` (#2563EB) - AA+ com texto branco
- Botão amarelo: `bg-yellow-600` (#CA8A04) - AA com texto branco
- Botão vermelho: `bg-red-600` (#DC2626) - AA+ com texto branco

### Modo Escuro
- Texto primário: `dark:text-gray-100` (#F3F4F6) - AA+ com fundo escuro
- Texto secundário: `dark:text-gray-300` (#D1D5DB) - AA+ com fundo escuro

## Recomendações

Todas as cores atuais atendem aos padrões WCAG AA. Para melhorar para AAA:

1. Considerar aumentar o contraste do botão amarelo para `bg-yellow-700`
2. Adicionar indicadores visuais além de cor (ícones, texto)

## Ferramentas de Validação

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/)
```

**Passo 3: Commit**

```bash
git add docs/accessibility/contrast-analysis.md
git commit -m "docs: adicionar análise de contraste de cores para acessibilidade"
```

---

## Task 10: Testes de unidade e integração

**Arquivos:**
- Criar: `frontend/src/components/__tests__/ListItem.test.tsx`
- Criar: `frontend/src/pages/__tests__/ListPage.test.tsx`
- Criar: `frontend/src/api/__tests__/item.test.ts`

**Pré-requisitos:** Configurar Vitest e React Testing Library se não estiverem configurados.

**Passo 1: Verificar se Vitest está configurado**

Verificar arquivo `frontend/vite.config.ts` e `frontend/package.json` para dependências de teste.

**Passo 2: Criar teste para ListItem**

Criar arquivo `frontend/src/components/__tests__/ListItem.test.tsx`:

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

**Passo 3: Criar teste para API client**

Criar arquivo `frontend/src/api/__tests__/client.test.ts`:

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

**Passo 4: Rodar os testes**

Execute: `npm run test`

Expected: Todos os testes passam.

**Passo 5: Commit**

```bash
git add frontend/src/components/__tests__/ frontend/src/api/__tests__/
git commit -m "test: adicionar testes de unidade para ListItem e apiRequest"
```

---

# FINALIZAÇÃO

## Task 11: Limpeza e Documentação

**Passo 1: Atualizar next-steps.md**

Marcar itens concluídos no arquivo `memory-bank/next-steps.md`.

**Passo 2: Criar ADR para mudanças de performance**

Se necessário, criar ADR documentando decisões de otimização.

**Passo 3: Commit final**

```bash
git add memory-bank/next-steps.md docs/adr/
git commit -m "docs: atualizar documentação com melhorias implementadas"
```

---

# Checklist de Verificação

Antes de considerar o plano completo:

- [ ] Task 1: useMemo no sortedItems
- [ ] Task 2: max-w-2xl no container
- [ ] Task 3: Remover h-screen do empty state
- [ ] Task 4: useCallback nos handlers
- [ ] Task 5: Unificar toggleItem e updateItem
- [ ] Task 6: Centralizar configuração HTTP
- [ ] Task 7: React.memo no ListItem
- [ ] Task 8: Hook useKeyboardNavigation
- [ ] Task 9: Análise de contraste
- [ ] Task 10: Testes de unidade
- [ ] Task 11: Documentação atualizada

---

# Observações Importantes

1. **TDD:** Sempre escreva testes antes de implementar (quando aplicável)
2. **Commits frequentes:** Cada task deve ter seu próprio commit
3. **Testes manuais:** Após cada mudança, teste a aplicação manualmente
4. **YAGNI:** Não adicione funcionalidades extras não solicitadas
5. **DRY:** Reuse código existente sempre que possível

---

## Referências

- Documentação original: `memory-bank/next-steps.md`
- ADRs existentes: `docs/adr/`
- Código atual: `frontend/src/`
