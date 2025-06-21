# Active Context: List Manager Frontend

## Current Work Focus
The primary focus is on implementing the core CRUD (Create, Read, Update, Delete) functionalities for 'Item' entities in the frontend application, consuming the existing Go backend.

## Recent Changes
- Initial frontend project setup using Vite, React, TypeScript, and Tailwind CSS.
- Integration of React Query for efficient data fetching and state management.
- Implementation of API service functions (`api/item.ts`) for all item operations.
- Development of the `ItemsPage.tsx` component to display, add, toggle, and delete items.
- Configuration for Progressive Web App (PWA) capabilities, including service worker and manifest, utilizing `vite-plugin-pwa` with `autoUpdate` functionality.
- Installation of all necessary npm dependencies.
- Successful build verification of the frontend project.
- **Documentação de Arquitetura (ADRs):** Foram criadas e renomeadas múltiplas Architectural Decision Records (ADRs) na pasta `docs/adr/` para documentar decisões chave sobre o framework (React), linguagem (TypeScript), ferramenta de build (Vite), gerenciamento de estado (React Query) e estilização (Tailwind CSS).
- Implementation of visual error feedback using **react-hot-toast** (toast notifications) and `ErrorBanner` component; decision documented in **ADR 07**.
- **Plano de Refatoração Executado (Curto Prazo e Code Smells):**
    - Versão do `react-router-dom` corrigida e dependências reinstaladas.
    - Script `npm run test` para Vitest adicionado e configurado com React Testing Library.
    - `ItemsPage.tsx` renomeada para `CreateItemPage.tsx` e suas referências atualizadas.
    - Tratamento de erros em `api/item.ts` aprimorado para propagar mensagens detalhadas.
    - `BASE_URL` em `api/item.ts` agora utiliza um valor padrão explícito (`/api`).
    - Atualizações otimistas implementadas nos hooks de mutação (`useItemMutations.ts`).
    - Contraste de cor do título em `ListPage.tsx` ajustado para melhor legibilidade.
    - Atributo `aria-pressed` adicionado aos botões de toggle em `ListPage.tsx` para acessibilidade.
    - Duplicação de ADRs (`adr-03-linguagem-typescript.md` e `adr-03-typescript.md`) verificada e confirmada como resolvida (o segundo arquivo não existe).

## Next Steps
1.  **Testing:** Implement unit and integration tests for frontend components and API interactions.
2.  **Observability & Error Logging:** Integrate frontend monitoring (e.g., Sentry, OpenTelemetry Web) to capture and analyze errors now that user-facing feedback is in place.
3.  **UI/UX Refinements:** Improve loading states, empty states, and overall user experience based on mobile-first design principles.
4.  **Filtering/Searching:** Add basic client-side filtering (e.g., active/inactive) and searching for items.
5.  **Offline Data Sync:** Implement more robust offline capabilities (e.g., optimistic updates, background sync) if required in future iterations.

## Active Decisions and Considerations
- **Backend Evolution:** Current frontend scope is limited to 'Item' entity due to backend constraints. Future work will require backend updates for 'List' and 'User' management.
- **Authentication:** No authentication implemented at this stage, aligning with the current backend API design.
- **Deployment:** Consider containerization (Docker) for both frontend and backend for easier deployment.
- **Observability:** Plan for frontend performance monitoring and error tracking (e.g., Sentry, OpenTelemetry Web).
- **PWA Auto-Update Behavior and `/app/version.json`:** A requisição frequente para `/_app/version.json` pelo frontend (resultando em 404 no backend) é um comportamento esperado do PWA configurado com `vite-plugin-pwa` para `autoUpdate`. Esta decisão arquitetural está documentada em [ADR 01: Decisão de Implementação de Progressive Web App (PWA) com Auto-Atualização](docs/adr/adr-01-pwa-auto-update.md). 