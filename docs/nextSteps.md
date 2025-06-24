# Next Steps: List Manager Frontend

## 1. Testes: Implementar testes unitários e de integração

**Objetivo:** Garantir a robustez do código, identificar bugs precocemente e facilitar futuras modificações.

*   **Testes Unitários:**
    *   **Onde:** Foco em componentes isolados (componentes de apresentação), custom hooks (como `useItems`, `useItemMutations`), e funções de serviço da API (`frontend/src/api/item.ts`).
    *   **Como:**
        *   Para componentes React: Use `@testing-library/react` para renderizar componentes e simular interações do usuário.
        *   Para hooks e funções de API: Mocke as chamadas de rede. Uma boa prática é usar o [Mock Service Worker (MSW)](https://mswjs.io/) para interceptar requisições HTTP em nível de rede, tornando os testes mais próximos do ambiente real.
        *   Utilize o padrão de **testes dirigidos por tabela** (`table-driven tests`) para testar diferentes cenários e entradas de funções de forma eficiente.
        *   Garanta que todas as funções exportadas, especialmente aquelas com lógica de negócios ou interação com a API, tenham cobertura de testes.

*   **Testes de Integração:**
    *   **Onde:** Foco na interação entre componentes e os hooks do React Query, garantindo que o fluxo de dados da UI para a API e vice-versa funcione corretamente.
    *   **Como:**
        *   Ainda use MSW para mockar as respostas da API, mas teste o comportamento completo de uma página (ex: `ItemsPage.tsx`) ao adicionar um item, alternar seu status ou deletá-lo.
        *   Verifique se o React Query está invalidando e refetching dados corretamente após mutações.

## 2. Tratamento de Erros: Melhorar as mensagens de erro e feedback ao usuário

**Objetivo:** Proporcionar uma experiência mais amigável e informativa em caso de falhas.

*   **Feedback Visual:**
    *   Implemente mensagens de erro visíveis para o usuário. Podem ser `toasts` (notificações temporárias), banners na parte superior da tela ou mensagens de erro inline (`<p>` de erro) ao lado dos campos de formulário.
    *   Quando ocorrer um erro de API, capture-o com o `onError` do React Query e exiba uma mensagem relevante (ex: "Falha ao carregar itens", "Não foi possível adicionar o item").

*   **Observabilidade (Frontend):**
    *   Considere integrar uma ferramenta de monitoramento de erros de frontend, como [Sentry](https://sentry.io/welcome/) ou configurar o [OpenTelemetry Web](https://opentelemetry.io/docs/instrumentation/js/getting-started/browser/) para rastreamento de erros e métricas de performance.
    *   Capture e logue erros de rede, erros de API e erros de tempo de execução do JavaScript com detalhes suficientes para depuração.

## 3. Refinamentos de UI/UX: Melhorar estados de carregamento, estados vazios e responsividade

**Objetivo:** Tornar a aplicação mais fluida, intuitiva e agradável de usar.

*   **Estados de Carregamento (`Loading States`):**
    *   Ao buscar dados da API, exiba indicadores de carregamento. Pode ser um `spinner` genérico, ou melhor, `skeleton loaders` que simulam a estrutura do conteúdo que está sendo carregado, dando uma sensação de velocidade.
    *   Utilize as propriedades `isLoading` e `isFetching` dos hooks do React Query.

*   **Estados Vazios (`Empty States`):</b>
    *   Quando não houver itens na lista, exiba uma mensagem clara informando isso (ex: "Nenhum item encontrado. Adicione o primeiro item!") e talvez um botão ou ícone convidando o usuário a adicionar um novo item.

*   **Responsividade:**
    *   Revise o layout da aplicação em diferentes tamanhos de tela (especialmente mobile) utilizando as classes utilitárias do Tailwind CSS.
    *   Teste a aplicação em emuladores de dispositivos móveis no navegador e, se possível, em dispositivos reais para garantir uma experiência consistente.
    *   Garanta que elementos interativos (botões, campos de input) sejam facilmente clicáveis/tocáveis em telas pequenas.

## 4. Filtragem/Busca: Adicionar filtragem básica no lado do cliente

**Objetivo:** Permitir que os usuários gerenciem listas maiores com mais facilidade.

*   **Filtragem por Status:**
    *   Adicione botões ou um dropdown para filtrar itens por status (ex: "Todos", "Ativos", "Inativos").
    *   A lógica de filtragem será no frontend, operando sobre a lista de itens já carregada.

*   **Barra de Busca:**
    *   Implemente um campo de input onde o usuário pode digitar e filtrar os itens pelo nome ou descrição.
    *   Considere implementar um `debounce` para o campo de busca, para evitar que a filtragem seja executada a cada caractere digitado, melhorando a performance.

## 5. Sincronização Offline: Implementar capacidades offline mais robustas

**Objetivo:** Aprimorar a experiência PWA, permitindo operações mesmo sem conexão imediata.

*   **Atualizações Otimistas (`Optimistic Updates`):**
    *   Para operações como adicionar, alternar status ou deletar um item, atualize a UI imediatamente como se a operação tivesse sido bem-sucedida, antes mesmo de receber a resposta do backend.
    *   Se a chamada de API falhar, reverta a alteração na UI e exiba uma mensagem de erro. O React Query tem suporte nativo para isso com a opção `onMutate`.

*   **Background Sync (PWA - mais avançado):**
    *   Para cenários onde o usuário tenta uma operação sem conexão e você quer que ela seja retentada automaticamente quando a conexão voltar, explore a [API de Background Sync](https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API) ou utilize recursos do [Workbox](https://developer.chrome.com/docs/workbox/) (parte do `vite-plugin-pwa`) para enfileirar requisições falhas e reexecutá-las offline. 