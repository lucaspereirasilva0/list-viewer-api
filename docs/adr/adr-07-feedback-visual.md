# ADR 07: Decisão de Arquitetura – Feedback Visual de Erros com react-hot-toast e ErrorBanner

## WHAT IS THIS ADR?
Este registro documenta a decisão técnica de como fornecer feedback visual de erros ao usuário na aplicação frontend. Ela abrange a escolha da biblioteca de toast, a criação de um componente de banner de erro e o padrão geral de exibição.

## DETAILS
- **Context:** O roadmap (`docs/nextSteps.md`) define a necessidade de melhorar o tratamento de erros, exibindo mensagens claras e não intrusivas. O frontend já manipula exceções via React Query, mas faltava uma camada de UI para comunicá-las ao usuário.
- **Decision:** 
  1. **Toasts para mutações:** Adotar a biblioteca **react-hot-toast** para apresentar notificações temporárias quando operações de mutação (criar, atualizar, deletar) falham. O componente `<Toaster>` foi adicionado globalmente em `src/main.tsx` (posição `top-right`, duração padrão 4 s).
  2. **Banner para listagem:** Criar um componente leve **`ErrorBanner.tsx`** utilizando Tailwind para exibir um alerta persistente quando a query de listagem inicial falhar (falha crítica de carregamento).
  3. **Integração:** `useItemMutations.ts` agora usa `toast.error()` em `onError`; `ListPage.tsx` utiliza `<ErrorBanner>` para erro de `useItems`.
- **Considered Alternatives:**
  - **react-toastify:** Mais completo, porém maior (≈ 20 KB gzip) e requer CSS externo.
  - **Radix UI / Headless UI + componente customizado:** Exige mais código e tempo de manutenção.
  - **Implementação própria apenas com Tailwind e `setTimeout`:** Simples, mas reinventa roda e carece de acessibilidade pronta.
  - **Somente banners inline:** Menos intrusivo, porém não escalável para múltiplas ações simultâneas.
- **Consequences:**
  - **Positivas:**
    - *Experiência do Usuário:* Feedback imediato e claro sobre falhas sem interromper fluxo.
    - *Bundle Pequeno:* `react-hot-toast` (~4 KB gzip) não impacta significativamente o tamanho final.
    - *Acessibilidade:* Biblioteca fornece atributos ARIA adequados; o banner usa `role="alert"`.
    - *Consistência:* Padrão único para todas mutações e listagem.
  - **Negativas:**
    - *Dependência Extra:* Novo pacote a ser mantido e atualizado.
    - *Potencial Conflito de Estilo:* Caso CSS global mude, pode ser necessário ajustar classes Tailwind do banner.
    - *Internacionalização:* Mensagens precisam ser centralizadas em um sistema de i18n futuro.

## CHANGELOG
- `<!-- preenchido automaticamente pelo git -->` – Version 1.0 – Document initialization.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-07-feedback-visual.md` (número sequencial após o ADR 06) 