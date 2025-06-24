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
- **`ListPage.tsx`:** Componente para exibir, gerenciar, adicionar e editar novos itens (incluindo toggle, delete, create e edit). O título principal "Sua Lista de Compras" foi ajustado para ser sempre visível, independentemente do estado de carregamento ou erro dos itens.
- **`api/item.ts`:** Contém funções puras para interagir com a backend API, com tratamento de erros aprimorado para mensagens detalhadas.
- **`queries/`:** Houses React Query hooks (`useItems`, `useItemMutations`, `useUpdateItem`) que abstraem API calls e gerenciam caching/invalidation com atualizações otimistas para mutações.

## API Interaction Patterns
- All API interactions are handled via standard `fetch` API calls, wrapped in utility functions in `api/item.ts`.
- Mutação de criação de item (`useCreateItem`) agora utiliza atualização otimista seguida de uma atualização direta do cache no `onSuccess` com o item real retornado pelo servidor, evitando uma refetching completa. As demais mutações (update, delete, toggle) continuam a utilizar atualizações otimistas antes de invalidar queries para garantir data freshness (`qc.invalidateQueries`).
- Error handling é aprimorado para tentar extrair e propagar mensagens de erro detalhadas da resposta da API. 