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
    - **Refinamentos de UI/UX:** Implementado um spinner de carregamento e um feedback visual aprimorado para estados vazios (empty states) em `ListPage.tsx`.
    - **Integração de Funcionalidades:** A funcionalidade de adição de item foi migrada de `CreateItemPage.tsx` para `ListPage.tsx`, eliminando a necessidade de uma página separada.
    - **Otimização de Transição:** Ajustes na lógica de atualização otimista em `useItemMutations.ts` para suavizar a transição visual ao adicionar novos itens.
    - **Limpeza de Código:** Remoção da rota `/create` e do componente `Navbar` em `App.tsx`, e exclusão do arquivo `CreateItemPage.tsx` obsoleto.
    - **Resolução de Linter:** Todos os erros e avisos de linter foram corrigidos.
    - **Implementação de Edição de Itens:** Adicionada funcionalidade de edição de itens na `ListPage.tsx`, incluindo botões de edição, campo de input condicional e botões de salvar/cancelar.
    - **Criação da Função `updateItem`:** Definida a função `updateItem` em `src/api/item.ts` para a comunicação com a API de atualização de itens.
    - **Criação do Hook `useUpdateItem`:** Implementado o hook `useUpdateItem` em `src/queries/useItemMutations.ts` para gerenciar a mutação de atualização de item com o React Query, incluindo lógica otimista e invalidação de cache.
    - **Resolução de Avisos do React Router:** Adicionadas as flags `v7_relativeSplatPath` e `v7_startTransition` ao `BrowserRouter` em `App.tsx` para resolver avisos de futuras versões do React Router.
    - **Diagnóstico e Solução de Problemas no Manifest PWA:** Identificado e trabalhado na resolução do erro de sintaxe no `manifest.webmanifest` (com a solução esperada sendo limpeza de cache e reinício do servidor).
    - **Edição In-Place:** Implementada a edição de itens diretamente no lugar (`in-place`) utilizando o atributo `contentEditable` em `ListItem.tsx`, removendo o campo de input separado. O foco é automaticamente definido no elemento editável ao clicar em 'Editar', com o cursor posicionado no final do texto.
    - **Padronização de UI:** Padronização do `border-radius` dos botões para `rounded-md` e revisão da consistência de espaçamento e tipografia.
    - **Aprimoramento de Design Responsivo Mobile-First:** Ajustes no tamanho da fonte para títulos e textos de estado vazio em `ListPage.tsx` e otimização do layout dos botões de ação em `ListItem.tsx` para melhor responsividade em telas pequenas.
    - **Título Fixo na Página:** O título principal "Sua Lista de Compras" em `ListPage.tsx` foi ajustado para permanecer fixo e sempre visível, mesmo durante o carregamento de itens ou em caso de falha no carregamento, garantindo uma transição visual mais suave e consistente para o usuário.
    - **Avaliação de Código e Arquitetura:** Realizada uma avaliação completa do código e da arquitetura do frontend, confirmando que está bem escrito, segue as boas práticas de React, TypeScript, e proporciona uma excelente experiência de usuário mobile. Não há necessidade urgente de refatoração significativa no momento, apenas pequenas otimizações e refinamentos para o futuro.

## Next Steps
1.  **Testing:** Implement unit and integration tests for frontend components and API interactions.
2.  **Observability & Error Logging:** Integrate frontend monitoring (e.g., Sentry, OpenTelemetry Web) to capture and analyze errors now that user-facing feedback is in place.
3.  **Filtering/Searching:** Add basic client-side filtering (e.g., active/inactive) and searching for items.
4.  **Offline Data Sync:** Implement more robust offline capabilities (e.g., optimistic updates, background sync) if required in future iterations.

## Active Decisions and Considerations
- **Backend Evolution:** Current frontend scope is limited to 'Item' entity due to backend constraints. Future work will require backend updates for 'List' and 'User' management.
- **Authentication:** No authentication implemented at this stage, aligning with the current backend API design.
- **Deployment:** Consider containerization (Docker) for both frontend and backend for easier deployment.
- **Observability:** Plan for frontend performance monitoring and error tracking (e.g., Sentry, OpenTelemetry Web).
- **PWA Auto-Update Behavior and `/app/version.json`:** A requisição frequente para `/_app/version.json` pelo frontend (resultando em 404 no backend) é um comportamento esperado do PWA configurado com `vite-plugin-pwa` para `autoUpdate`. Esta decisão arquitetural está documentada em [ADR 01: Decisão de Implementação de Progressive Web App (PWA) com Auto-Atualização](docs/adr/adr-01-pwa-auto-update.md). 