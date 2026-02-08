# Next Steps - Improvement List

Documentation of improvements identified in the project analysis, organized by priority.

**Last updated:** 2026-02-03
**Status:** All high and medium priority tasks have been completed.

---

## ✅ High Priority (COMPLETED)

### ~~1. Optimize `sortedItems` with `useMemo`~~ ✅
**File:** `frontend/src/pages/ListPage.tsx`

**Status:** COMPLETED
**Problem:** Sorting is recalculated on every render.

**Implemented solution:**
```typescript
// Lines 102-113 of ListPage.tsx
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

### ~~2. Add max-width to main container~~ ✅
**File:** `frontend/src/pages/ListPage.tsx`

**Status:** COMPLETED
**Problem:** On large screens, the list becomes too wide, harming UX.

**Implemented solution:**
```typescript
// Line 116 of ListPage.tsx
<div className="container mx-auto p-4 max-w-2xl">
  // content
</div>
```

---

### ~~3. Remove `h-screen` from empty state~~ ✅
**File:** `frontend/src/pages/ListPage.tsx:195`

**Status:** COMPLETED
**Problem:** Creates unnecessary scroll when there are items in the list.

**Implemented solution:**
```typescript
// Line 195 of ListPage.tsx - replaced h-screen with responsive min-h
<div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] px-4">
```

---

### ~~4. Use `useCallback` in event handlers~~ ✅
**File:** `frontend/src/pages/ListPage.tsx`

**Status:** COMPLETED
**Problem:** Handlers are recreated on every render, potentially causing unnecessary re-renders in child components.

**Implemented solution:**
```typescript
// Lines 55-100 of ListPage.tsx
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

## ✅ Medium Priority (COMPLETED)

### ~~5. Unify `toggleItem` and `updateItem` in the API~~ ✅
**File:** `frontend/src/api/item.ts`

**Status:** COMPLETED
**Problem:** The functions `toggleItem` and `updateItem` were identical.

**Implemented solution:** Kept only `updateItem` (line 53-68) and used it for both cases through React Query hooks.

---

### ~~6. Extract ngrok header to centralized configuration~~ ✅
**File:** `frontend/src/api/client.ts`

**Status:** COMPLETED
**Problem:** Header `ngrok-skip-browser-warning` hardcoded in multiple calls.

**Implemented solution:**
```typescript
// File created: frontend/src/api/client.ts
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

### ~~7. Add `React.memo` to `ListItem`~~ ✅
**File:** `frontend/src/components/ListItem.tsx`

**Status:** COMPLETED
**Problem:** Component re-renders when other items change.

**Implemented solution:**
```typescript
// Line 22 of ListItem.tsx
export const ListItem = React.memo(function ListItem({
  item,
  editingItemId,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
}: ListItemProps) {
  // implementation
});
```

---

### ~~8. Improve keyboard navigation~~ ✅
**Files:** `frontend/src/hooks/useKeyboardNavigation.ts`, `frontend/src/components/ListItem.tsx`

**Status:** COMPLETED
**Problem:** Lacks adequate keyboard navigation support.

**Implemented solution:**
- Created `useKeyboardNavigation` hook (line 33-62)
- Support for Enter, Escape and Tab keys in all editable fields
- Consistent navigation throughout the form

---

## ✅ Low Priority (COMPLETED)

### ~~9. Color contrast analysis~~ ✅
**File:** `docs/accessibility/contrast-analysis.md`

**Status:** COMPLETED
**Problem:** Possible contrast issues, especially in dark mode.

**Implemented solution:** Document created with complete contrast analysis. All colors meet WCAG AA standards.

---

### ~~10. Smoother transitions~~ ✅
**Status:** PARTIALLY COMPLETED
**Implemented solution:** CSS transitions added to all buttons and interactive elements (transition-all duration-200 ease-in-out)

---

### ~~11. Unit and integration tests~~ ✅
**Files:** `frontend/src/components/__tests__/ListItem.test.tsx`, `frontend/src/api/__tests__/client.test.ts`

**Status:** COMPLETED
**Implemented solution:** Tests configured with Vitest and React Testing Library:
- `ListItem.test.tsx`: Rendering, interaction and state tests
- `client.test.ts`: HTTP client and header tests

---

## 📊 Other Observations

### Security
- Assess need to remove ngrok header in production
- Plan authentication implementation

### PWA
- Implement Background Sync for better offline experience
- Evaluate IndexedDB usage for data cache

### Performance Monitoring
- Integrate monitoring tool (Sentry, OpenTelemetry)
- Add usage analytics

---

## 🔗 References

- Complete analysis available in the conversation with Claude
- Current documentation in `memory-bank/`
- ADRs in `docs/adr/`
