# ADR 05: Decisão de Arquitetura - Adoção de React Query

## WHAT IS THIS ADR?
Este documento registra a decisão arquitetural de utilizar `@tanstack/react-query` (anteriormente React Query) para o gerenciamento de estado de servidor, cache de dados assíncronos e sincronização no frontend da aplicação de gerenciamento de lista.

## DETAILS
- **Context:** A aplicação frontend necessita de uma maneira eficiente e robusta para buscar, armazenar em cache, sincronizar e atualizar dados do servidor (a API RESTful em Go). Gerenciar o estado assíncrono diretamente no React pode levar a complexidades como estados de carregamento, erros, refetching e invalidação de cache manual. O documento `frontend/ARQUITETURA_FRONTEND.md` destaca React Query como uma "Biblioteca de cache/ fetch assíncrono" e descreve como ele é usado nos hooks em `src/queries/`.
- **Decision:** Foi decidido integrar `@tanstack/react-query` para lidar com todas as interações de dados assíncronos. Esta escolha visa simplificar o gerenciamento de estado de servidor, otimizar o desempenho da aplicação através de caching inteligente e automatizar tarefas como revalidação de dados e tratamento de requisições concorrentes.
- **Considered Alternatives:** O documento de arquitetura não especifica alternativas explícitas ao React Query para gerenciamento de estado de servidor (e.g., SWR, Apollo Client/Relay para GraphQL, Redux-Saga/Thunk com fetch manual). A decisão por React Query é apresentada como fundamental para a forma como os dados são consumidos e gerenciados na aplicação, sugerindo uma preferência por uma solução dedicada e otimizada para dados de servidor em REST.
- **Consequences:**
    - **Positivas:**
        - **Simplificação do Código:** Reduz a necessidade de boilerplate para gerenciar estados de carregamento, erro e dados em componentes.
        - **Caching e Performance:** O cache automático e as estratégias de revalidação melhoram a performance da UI e reduzem o número de requisições desnecessárias à API.
        - **Experiência do Desenvolvedor Aprimorada:** Oferece hooks poderosos e intuitivos (`useQuery`, `useMutation`) que facilitam a interação com dados remotos.
        - **Otimizações Automáticas:** Lida automaticamente com revalidação de dados em foco da janela, retries de requisições falhas e deduping de requisições duplicadas.
        - **Invalidação de Cache:** A funcionalidade de `invalidateQueries` garante que a UI reflita o estado mais recente do servidor após mutações.
    - **Negativas:**
        - **Curva de Aprendizagem:** Requer um entendimento dos conceitos específicos do React Query (queries, mutations, cache keys).
        - **Abstração:** Embora benéfica, a abstração pode, em casos raros, tornar o debug de problemas complexos um pouco mais desafiador se o desenvolvedor não entender o funcionamento interno.
        - **Tamanho da Dependência:** Adiciona uma dependência à aplicação, embora seja otimizada para o que oferece.

## CHANGELOG
- `<!-- preenchido automaticamente pelo git -->` - Version 1.0 - Document initialization.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-XX-document-title.md` (where XX is a sequential number) 