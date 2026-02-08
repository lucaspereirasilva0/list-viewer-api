# Frontend Architecture

> Last updated: <!-- auto-filled by git -->

## Overview

This frontend is a **React + TypeScript** application built with **Vite**. The goal is to provide a simple interface to manage a **shopping list** by consuming a REST API.  
The application follows a lean and modular structure, leveraging **React Query** for asynchronous data management and **Tailwind CSS** for utility styling.

### Key Technologies

| Technology | Purpose |
|------------|--------|
| [React](https://react.dev/) | Declarative UI library |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Vite](https://vitejs.dev/) | Fast bundler and dev-server |
| [@tanstack/react-query](https://tanstack.com/query/latest) | Cache/async fetch |
| [Tailwind CSS](https://tailwindcss.com/) | Utility CSS |
| [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/) | PWA generation (manifest, icons, offline) |

---

## Simplified Directory Structure

```
frontend/
├─ index.html          # Entry HTML loaded by Vite
├─ package.json        # Dependencies and npm scripts
├─ vite.config.ts      # Vite + PWA configuration
├─ tailwind.config.js  # Tailwind configuration
├─ postcss.config.js   # PostCSS pipeline
└─ src/
   ├─ main.tsx         # React entry point
   ├─ App.tsx          # Root component
   ├─ index.css        # Imports @tailwind directives
   ├─ api/             # Isolated HTTP services
   │   └─ item.ts      # Item CRUD
   ├─ queries/         # React Query hooks
   │   ├─ useItems.ts          # GET /items
   │   └─ useItemMutations.ts  # POST / PUT / DELETE
   ├─ components/
   │   ├─ ErrorBanner.tsx    # Visual error banner
   │   ├─ ItemSkeleton.tsx   # Skeleton loader for items
   │   └─ ListItem.tsx       # Component to render a single list item
   └─ pages/
       └─ ListPage.tsx # Main page (list + form)
```

---

## Execution Flow

1. **`index.html`** contains an empty `<div id="root">` and imports the `src/main.tsx` bundle.
2. **`main.tsx`** creates a `QueryClient` (React Query cache) and renders `<App>` inside `<QueryClientProvider>`.
3. **`App.tsx`** is currently a thin component that just delegates to `<ListPage />`.
4. **`ListPage.tsx`**:
   - Fetches the item list via **`useItems`**.
   - Has `useCreateItem`, `useDeleteItem`, `useToggleItem` for mutations.
   - Renders the creation form and the list.
5. Hooks in **`queries/`** orchestrate HTTP calls defined in **`api/item.ts`** and invalidate the cache when necessary.
6. Styles are applied by **Tailwind** classes present in JSX.

---

## Module Details

### 1. `src/main.tsx`
Responsible for:
- Creating the React *root* with `ReactDOM.createRoot`.
- Instantiating `QueryClient` and providing global React Query context.
- Importing base CSS (`index.css`).

```tsx
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  )
```

### 2. `src/App.tsx`
Thin layer that centralizes routing or global layout (in the future). Currently just:
```tsx
function App() {
  return <ListPage />
}
```

### 3. `src/pages/ListPage.tsx`
Page component that incorporates UI + domain logic:
- **Reading**: `useItems` returns `data`, `isLoading` etc.
- **Creation**: `useCreateItem` creates an item and then invalidates the `items` query to reload.
- **Toggle**: `useToggleItem` changes the `active` state.
- **Deletion**: `useDeleteItem` removes the item.
- Uses `useState` to control the input text.
- Delegates the rendering of each individual item to the `<ListItem />` component.

### 4. API – `src/api/item.ts`
Isolated remote access layer from UI:
- Exports `Item` interface.
- Functions `listItems`, `createItem`, `deleteItem`, `toggleItem` – each makes `fetch` to REST routes.
- Base endpoint comes from `import.meta.env.VITE_API_URL` allowing environment configuration via Vite.

### 5. Data Hooks – `src/queries/`
Abstractions over React Query:
- **`useItems`** → `useQuery(['items'], listItems)`.
- **`useItemMutations`** exports three hooks from `useMutation` that call API functions and, in `onSuccess`, call `qc.invalidateQueries({queryKey:['items']})` – performs cache-invalid for automatic refetch.

### 6. Styling
- File `src/index.css` imports Tailwind directives `@tailwind base; components; utilities;`.
- `tailwind.config.js` limits *purge* to project files, keeping bundle lean.

### 7. Build Configurations
- **`vite.config.ts`** adds React plugin and `vite-plugin-pwa` to transform the app into PWA (manifest, icons, service worker auto-update).
- **`postcss.config.js`** enables Tailwind + autoprefixer.
- **`tsconfig.json`** defines *strict* compilation.

---

## How to Run Locally

```bash
cd frontend
npm install          # or pnpm / yarn
npm run dev          # starts Vite in development mode
```

Environment variables can be defined in a `.env` file (Vite loads automatically):
```
VITE_API_URL=http://localhost:8080
```

On first use, Vite will open `http://localhost:5173`.

### Production Build
```
npm run build   # generates static files in dist/
```

### Preview Build
```
npm run preview
```

---

## Next Steps Suggested Study

1. **React Router** for multiple pages and navigation.
2. **Larger Component Composition**: extract `<ItemCard>` etc.
3. **Tests** with `Jest + React Testing Library`.
4. **CI/CD**: configure lint, test, build pipeline.
5. **Theme Switcher**: leverage Tailwind's `dark:` to toggle theme.

---

> We hope this documentation makes the functioning of each module clearer. Feel free to open *issues* or PRs with improvements!
