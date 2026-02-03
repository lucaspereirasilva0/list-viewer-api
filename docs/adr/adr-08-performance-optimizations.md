# ADR 08: Decisão de Arquitetura - Otimizações de Performance

## WHAT IS THIS ADR?
Este documento registra as decisões arquiteturais tomadas para otimizar a performance do frontend da aplicação de gerenciamento de lista de compras, incluindo melhorias de React rendering, refatoração de API e acessibilidade.

## DETAILS
- **Context:** O frontend da aplicação de lista de compras apresentava oportunidades de otimização de performance e refatoração de código. Análises identificaram que o sorting de itens era recalculado em toda renderização, handlers de eventos eram recriados desnecessariamente, e não havia memoização adequada de componentes.

- **Decision:** Implementamos um conjunto abrangente de otimizações focado em:
  1. Performance do React usando hooks otimizadores
  2. Refatoração da API para eliminar duplicação
  3. Melhorias de UX e acessibilidade
  4. Cobertura de testes automatizados

- **Considered Alternatives:**
  - **Manter código como estava:** Rejeitado pois causava re-renders desnecessários e performance degradada em listas maiores.
  - **Usar biblioteca de gerenciamento de estado global (Redux/Zustand):** Considerado mas rejeitado pois o React Query já gerencia o estado de servidor adequadamente.
  - **Implementar virtualização de lista (react-window):** Considerado para listas muito grandes, mas adiado pois as otimizações implementadas foram suficientes para o caso de uso atual.

- **Consequences:**
    - **Positivas:**
        - **Melhor Performance:** `useMemo` no sorting evita recalculos desnecessários, `useCallback` estabiliza referências de funções, e `React.memo` previne re-renders do ListItem.
        - **Código Mais Manutenível:** Centralização da configuração HTTP em `client.ts` elimina duplicação e facilita manutenção.
        - **Melhor UX:** Largura máxima no container e empty state responsivo melhoram a experiência em telas grandes.
        - **Maior Acessibilidade:** Hook `useKeyboardNavigation` e análise de contraste de cores garantem melhor suporte a navegação por teclado e leitura.
        - **Confiança no Código:** Testes automatizados com Vitest e React Testing Library validam o comportamento dos componentes.
    - **Negativas:**
        - **Complexidade Levemente Aumentada:** Uso de hooks adicionais (useMemo, useCallback) requer entendimento adequado.
        - **Mais Arquivos:** Criação de novos arquivos (client.ts, hooks, testes) aumenta a superfície do código.
        - **Curva de Aprendizado:** Desenvolvedores novos precisam entender as decisões de otimização tomadas.

## IMPLEMENTAÇÃO

### 1. React Performance Hooks
- **useMemo:** Memoização do sorting de itens (`ListPage.tsx:102-113`)
- **useCallback:** Estabilização de handlers de eventos (`ListPage.tsx:55-100`)
- **React.memo:** Memoização do componente ListItem (`ListItem.tsx:22`)

### 2. API Refactoring
- **Unificação de funções:** Removida função duplicada `toggleItem`, mantendo apenas `updateItem` (`item.ts:53-68`)
- **Centralização HTTP:** Criado `client.ts` para configuração centralizada de headers e requisições

### 3. UX Improvements
- **Largura máxima:** Container com `max-w-2xl` para melhor legibilidade em telas grandes (`ListPage.tsx:116`)
- **Empty state responsivo:** Substituído `h-screen` por `min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh]` (`ListPage.tsx:195`)
- **Transições suaves:** Adicionadas classes de transição em elementos interativos

### 4. Accessibility
- **Hook de navegação:** Criado `useKeyboardNavigation.ts` para gerenciar eventos de teclado globalmente
- **Análise de contraste:** Documento em `docs/accessibility/contrast-analysis.md` valida cores contra WCAG AA
- **Aria labels:** Botões possuem `aria-label` e `aria-pressed` apropriados

### 5. Testing
- **Testes de componente:** `ListItem.test.tsx` valida renderização, estados e interações
- **Testes de API:** `client.test.ts` valida configuração HTTP e headers
- **Configuração:** Vitest configurado em `vite.config.ts:40-44`

## CHANGELOG
- `2026-02-03` - Version 1.0 - Document initialization. Registro das otimizações de performance implementadas.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-XX-document-title.md` (where XX is a sequential number)
- **Related Files:**
  - `/Users/lucaspereira/Desktop/list-viewer-api/frontend/src/pages/ListPage.tsx`
  - `/Users/lucaspereira/Desktop/list-viewer-api/frontend/src/components/ListItem.tsx`
  - `/Users/lucaspereira/Desktop/list-viewer-api/frontend/src/api/client.ts`
  - `/Users/lucaspereira/Desktop/list-viewer-api/frontend/src/api/item.ts`
  - `/Users/lucaspereira/Desktop/list-viewer-api/frontend/src/hooks/useKeyboardNavigation.ts`
  - `/Users/lucaspereira/Desktop/list-viewer-api/frontend/src/components/__tests__/ListItem.test.tsx`
  - `/Users/lucaspereira/Desktop/list-viewer-api/frontend/src/api/__tests__/client.test.ts`
  - `/Users/lucaspereira/Desktop/list-viewer-api/docs/accessibility/contrast-analysis.md`
