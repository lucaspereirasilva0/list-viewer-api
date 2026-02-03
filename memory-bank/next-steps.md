# Próximos Passos - Lista de Melhorias

Documentação das melhorias identificadas na análise do projeto, organizadas por prioridade.

**Última atualização:** 2026-02-03
**Status:** Todas as tarefas de alta e média prioridade foram concluídas.

---

## ✅ Alta Prioridade (CONCLUÍDO)

### ~~1. Otimizar `sortedItems` com `useMemo`~~ ✅
**Arquivo:** `frontend/src/pages/ListPage.tsx`

**Status:** CONCLUÍDO
**Problema:** O sorting é recalculado em toda renderização.

**Solução implementada:**
```typescript
// Linha 102-113 do ListPage.tsx
const sortedItems = useMemo(() => {
  if (!items) return undefined;
  return [...items].sort((a, b) => {
    const activeComparison = (b.active ? 1 : 0) - (a.active ? 1 : 0);
    if (activeComparison !== 0) return activeComparison;
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}, [items]);
```

---

### ~~2. Adicionar largura máxima no container principal~~ ✅
**Arquivo:** `frontend/src/pages/ListPage.tsx`

**Status:** CONCLUÍDO
**Problema:** Em telas grandes, a lista fica muito larga, prejudicando a UX.

**Solução implementada:**
```typescript
// Linha 116 do ListPage.tsx
<div className="container mx-auto p-4 max-w-2xl">
  // conteúdo
</div>
```

---

### ~~3. Remover `h-screen` do empty state~~ ✅
**Arquivo:** `frontend/src/pages/ListPage.tsx:195`

**Status:** CONCLUÍDO
**Problema:** Cria scroll desnecessário quando há itens na lista.

**Solução implementada:**
```typescript
// Linha 195 do ListPage.tsx - substituído h-screen por min-h responsivo
<div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] px-4">
```

---

### ~~4. Usar `useCallback` nos handlers de eventos~~ ✅
**Arquivo:** `frontend/src/pages/ListPage.tsx`

**Status:** CONCLUÍDO
**Problema:** Handlers são recriados em toda render, podendo causar re-renders desnecessários em componentes filhos.

**Solução implementada:**
```typescript
// Linhas 55-100 do ListPage.tsx
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

const handleEdit = useCallback((item: Item) => {
  setEditingItemId(item.id);
}, []);

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

const handleCancelEdit = useCallback(() => {
  setEditingItemId(null);
}, []);

const handleToggle = useCallback((item: Item) => {
  toggleItem.mutate({ ...item, active: !item.active });
}, [toggleItem]);

const handleDelete = useCallback((id: string) => {
  deleteItem.mutate(id);
}, [deleteItem]);
```

---

## ✅ Média Prioridade (CONCLUÍDO)

### ~~5. Unificar `toggleItem` e `updateItem` na API~~ ✅
**Arquivo:** `frontend/src/api/item.ts`

**Status:** CONCLUÍDO
**Problema:** As funções `toggleItem` e `updateItem` eram idênticas.

**Solução implementada:** Mantida apenas `updateItem` (linha 53-68) e utilizada para ambos os casos através dos hooks do React Query.

---

### ~~6. Extrair header ngrok para configuração centralizada~~ ✅
**Arquivo:** `frontend/src/api/client.ts`

**Status:** CONCLUÍDO
**Problema:** Header `ngrok-skip-browser-warning` hardcoded em múltiplas chamadas.

**Solução implementada:**
```typescript
// Arquivo criado: frontend/src/api/client.ts
const API_CLIENT = {
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
};

export async function apiRequest(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: { ...API_CLIENT.headers, ...options?.headers },
  });
}
```

---

### ~~7. Adicionar `React.memo` no `ListItem`~~ ✅
**Arquivo:** `frontend/src/components/ListItem.tsx`

**Status:** CONCLUÍDO
**Problema:** Componente re-renderiza quando outros itens mudam.

**Solução implementada:**
```typescript
// Linha 22 do ListItem.tsx
export const ListItem = React.memo(function ListItem({
  item,
  editingItemId,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
}: ListItemProps) {
  // implementação
});
```

---

### ~~8. Melhorar navegação por teclado~~ ✅
**Arquivos:** `frontend/src/hooks/useKeyboardNavigation.ts`, `frontend/src/components/ListItem.tsx`

**Status:** CONCLUÍDO
**Problema:** Falta suporte adequado para navegação por teclado.

**Solução implementada:**
- Criado hook `useKeyboardNavigation` (linha 33-62)
- Suporte a teclas Enter, Escape e Tab em todos os campos editáveis
- Navegação consistente em todo o formulário

---

## ✅ Baixa Prioridade (CONCLUÍDO)

### ~~9. Análise de contraste de cores~~ ✅
**Arquivo:** `docs/accessibility/contrast-analysis.md`

**Status:** CONCLUÍDO
**Problema:** Possíveis problemas de contraste, especialmente em dark mode.

**Solução implementada:** Documento criado com análise completa de contraste. Todas as cores atendem aos padrões WCAG AA.

---

### ~~10. Animações mais suaves nas transições~~ ✅
**Status:** PARCIALMENTE CONCLUÍDO
**Solução implementada:** Transições CSS adicionadas em todos os botões e elementos interativos (transition-all duration-200 ease-in-out)

---

### ~~11. Testes de unidade e integração~~ ✅
**Arquivos:** `frontend/src/components/__tests__/ListItem.test.tsx`, `frontend/src/api/__tests__/client.test.ts`

**Status:** CONCLUÍDO
**Solução implementada:** Testes configurados com Vitest e React Testing Library:
- `ListItem.test.tsx`: Testes de renderização, interação e estados
- `client.test.ts`: Testes do cliente HTTP e headers

---

## 📊 Outras Observações

### Segurança
- Avaliar necessidade de remover header ngrok em produção
- Planejar implementação de autenticação

### PWA
- Implementar Background Sync para melhor experiência offline
- Avaliar uso de IndexedDB para cache de dados

### Performance Monitoring
- Integrar ferramenta de monitoramento (Sentry, OpenTelemetry)
- Adicionar analytics de uso

---

## 🔗 Referências

- Análise completa disponível na conversa com Claude
- Documentação atual em `memory-bank/`
- ADRs em `docs/adr/`
