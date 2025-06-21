# Progress: List Manager Frontend

## What Works
-   **Project Setup:** The basic frontend project is set up with Vite, React, TypeScript, and Tailwind CSS.
-   **Dependency Management:** `npm install` successfully installs all project dependencies.
-   **Build Process:** The application successfully builds to static assets (`npm run build`).
-   **Development Server:** The development server starts correctly (`npm run dev`).
-   **Item Listing:** The application fetches and displays items from the backend API (`GET /items`).
-   **Item Creation:** Users can add new items, which are persisted via the backend (`POST /item`).
-   **Item Toggling:** Items can be marked as active/inactive, updating their status in the backend (`PUT /item`).
-   **Item Deletion:** Items can be successfully removed from the list and backend (`DELETE /item`).
-   **Error Feedback UI:** Visual feedback for errors added using react-hot-toast (toast notifications) and ErrorBanner for list loading errors.
-   **PWA Core:** Basic PWA manifest and service worker registration are in place, providing offline caching for static assets.
-   **Documentação ADRs:** As Architectural Decision Records (ADRs) para as principais escolhas tecnológicas (React, TypeScript, Vite, React Query, Tailwind CSS) foram criadas e padronizadas na nomenclatura.
-   **Refatorações de Curto Prazo e Code Smells (Concluídas):**
    -   `react-router-dom` atualizado para versão estável e dependências reinstaladas.
    -   Script `npm run test` com Vitest e React Testing Library configurados.
    -   `ItemsPage.tsx` renomeada para `CreateItemPage.tsx` e referências ajustadas.
    -   Tratamento de erros em `api/item.ts` aprimorado (propagação de mensagens detalhadas).
    -   `BASE_URL` em `api/item.ts` com valor padrão explícito (`/api`).
    -   Atualizações otimistas implementadas nos hooks de mutação (`useItemMutations.ts`).
    -   Contraste de cor do título em `ListPage.tsx` ajustado.
    -   `aria-pressed` adicionado aos botões de toggle em `ListPage.tsx` para acessibilidade.
    -   Duplicação de ADRs (`adr-03-linguagem-typescript.md` e `adr-03-typescript.md`) verificada e resolvida (um dos arquivos não existia).

## What's Left to Build (and Improve)
-   **Loading States:** Add clear loading indicators for data fetching operations.
-   **Empty States:** Provide visual feedback when the item list is empty.
-   **Filtering and Search:** Implement basic client-side filtering (e.g., active, inactive) and a search bar for items.
-   **UI/UX Polish:** Further refine the mobile-first responsive design and overall user experience.
-   **Advanced PWA Features:** Explore optimistic UI updates and background sync for a more seamless offline experience.
-   **Testing Suite:** Develop comprehensive unit and integration tests for components, hooks, and API interactions.
-   **Observability & Error Logging:** Integrate a monitoring tool (e.g., Sentry, OpenTelemetry Web) to log and track errors.

## Current Status
The core CRUD functionality for 'Item' entities is implemented and functional. User-facing error feedback is now in place via toast notifications and banners. O plano de refatoração de curto prazo e os code smells foram totalmente abordados, incluindo melhorias de dependências, testes básicos, renomeação de componentes, tratamento de erros, acessibilidade e otimização de cache. A aplicação permanece responsiva e PWA-enabled; próximo foco em CI, cobertura de testes e observabilidade.

## Known Issues
-   Currently, only 'Item' management is supported; 'List' and 'User' functionalities are dependent on backend expansion.
-   No explicit authentication mechanism is in place, meaning all item operations are public. 