# Próximos Passos - Lista de Melhorias

Documentação das melhorias identificadas na análise do projeto, organizadas por prioridade.

---

## 🚯 Alta Prioridade

### 1. Otimizar `sortedItems` com `useMemo`
**Arquivo:** `frontend/src/pages/ListPage.tsx`

**Problema:** O sorting é recalculado em toda renderização.

**Solução:**
```typescript
const sortedItems = useMemo(() => {
  return items?.sort((a, b) => {
    const activeComparison = (b.active ? 1 : 0) - (a.active ? 1 : 0);
    if (activeComparison !== 0) return activeComparison;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}, [items]);
```

---

### 2. Adicionar largura máxima no container principal
**Arquivo:** `frontend/src/pages/ListPage.tsx`

**Problema:** Em telas grandes, a lista fica muito larga, prejudicando a UX.

**Solução:**
```typescript
<div className="container mx-auto p-4 max-w-2xl">
  // conteúdo
</div>
```

---

### 3. Remover `h-screen` do empty state
**Arquivo:** `frontend/src/pages/ListPage.tsx:187`

**Problema:** Cria scroll desnecessário quando há itens na lista.

**Solução:** Substituir `h-screen` por `min-h-[50vh]` ou altura fixa menor.

---

### 4. Usar `useCallback` nos handlers de eventos
**Arquivo:** `frontend/src/pages/ListPage.tsx`

**Problema:** Handlers são recriados em toda render, podendo causar re-renders desnecessários em componentes filhos.

**Solução:**
```typescript
const handleCreateSubmit = useCallback(() => {
  // implementação
}, [createItem]);

const handleEdit = useCallback((item: Item) => {
  setEditingItemId(item.id);
}, []);

// aplicar para outros handlers
```

---

## 🎯 Média Prioridade

### 5. Unificar `toggleItem` e `updateItem` na API
**Arquivo:** `frontend/src/api/item.ts`

**Problema:** As funções `toggleItem` e `updateItem` são idênticas.

**Solução:** Manter apenas `updateItem` e usá-la para ambos os casos.

---

### 6. Extrair header ngrok para configuração centralizada
**Arquivos:** `frontend/src/api/item.ts`

**Problema:** Header `ngrok-skip-browser-warning` hardcoded em múltiplas chamadas.

**Solução:** Criar um client HTTP configurado:
```typescript
// src/api/client.ts
const API_CLIENT = {
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
};

export async function apiRequest(url: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    headers: { ...API_CLIENT.headers, ...options?.headers },
  });
}
```

---

### 7. Adicionar `React.memo` no `ListItem`
**Arquivo:** `frontend/src/components/ListItem.tsx`

**Problema:** Componente re-renderiza quando outros itens mudam.

**Solução:**
```typescript
export const ListItem = React.memo(function ListItem({
  item,
  // props
}: ListItemProps) {
  // implementação
});
```

---

### 8. Melhorar navegação por teclado
**Arquivos:** `frontend/src/pages/ListPage.tsx`, `frontend/src/components/ListItem.tsx`

**Problema:** Falta suporte adequado para navegação por teclado.

**Solução:** Adicionar suporte a teclas como Tab, Enter, Escape de forma consistente.

---

## 📌 Baixa Prioridade

### 9. Análise de contraste de cores
**Arquivo:** `frontend/src/pages/ListPage.tsx`, `frontend/src/components/ListItem.tsx`

**Problema:** Possíveis problemas de contraste, especialmente em dark mode.

**Solução:** Usar ferramentas como [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) e ajustar cores.

---

### 10. Animações mais suaves nas transições
**Arquivos:** Componentes da UI

**Solução:** Adicionar transições CSS ou biblioteca como Framer Motion para animações mais suaves.

---

### 11. Testes de unidade e integração
**Status:** Já planejado no `progress.md`

**Solução:** Implementar testes com Vitest e React Testing Library.

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
