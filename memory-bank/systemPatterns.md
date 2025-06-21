# System Patterns: List Manager Frontend

## System Architecture
The frontend application operates as a Single Page Application (SPA) with Progressive Web App (PWA) capabilities, consuming a RESTful API provided by a Go backend.

```mermaid
flowchart LR
    User[User] -->|Accesses via Browser/PWA| Frontend[Frontend Application (React, Vite, PWA)]
    Frontend -->|HTTP/REST Calls| Backend[Backend API (Go)]
    Backend -->|Data Persistence| Database[(Database - e.g., MongoDB/In-memory)]
```

## Key Technical Decisions
- **Client-Side Rendering (CSR):** The application is primarily rendered on the client side.
- **PWA First:** Designed to be installable and provide offline capabilities through service workers.
- **Reactive State Management:** Uses React Query for data fetching, caching, synchronization, and managing server state.

## Design Patterns in Use
- **Component-Based Architecture:** UI built with reusable React components.
- **Container/Presentational Components:** Separation of concerns between data fetching/logic (container) and UI rendering (presentational).
- **Hooks (React):** Extensive use of custom hooks for reusable logic (e.g., `useItems`, `useCreateItem`).
- **Dependency Injection (Backend):** Although this document is for the frontend, it acknowledges the backend's use of DI for modularity.

## Component Relationships (Frontend)
- **`App.tsx`:** Root component, sets up `QueryClientProvider`.
- **`CreateItemPage.tsx`:** Componente para adicionar novos itens (anteriormente `ItemsPage.tsx`).
- **`ListPage.tsx`:** Componente para exibir e gerenciar a lista de itens (incluindo toggle e delete).
- **`api/item.ts`:** Contém funções puras para interagir com a backend API, com tratamento de erros aprimorado para mensagens detalhadas.
- **`queries/`:** Houses React Query hooks (`useItems`, `useItemMutations`) que abstraem API calls e gerenciam caching/invalidation com atualizações otimistas para mutações.

## API Interaction Patterns
- All API interactions are handled via standard `fetch` API calls, wrapped in utility functions in `api/item.ts`.
- Mutations (create, update, delete) agora utilizam atualizações otimistas no cache do React Query antes de invalidar queries para garantir data freshness (`qc.invalidateQueries`).
- Error handling é aprimorado para tentar extrair e propagar mensagens de erro detalhadas da resposta da API. 