# Refactoring Plan: Frontend List Manager

_Última atualização: <!-- preenchido automaticamente pelo git -->_

## Visão Geral da Análise
Este documento consolida a revisão completa do código frontend, com base na arquitetura descrita em `docs/ARQUITETURA_FRONTEND.md`. Abrange:
- Código não utilizado
- Lacunas de testes
- Code smells identificados
- Recomendações de ação (curto, médio e longo prazo)

---

## 1. Código não utilizado / Arquivos órfãos
| Arquivo | Trecho | Observação |
|---------|--------|------------|
| `frontend/src/pages/ItemsPage.tsx` | Página apenas cria itens, não lista | (Concluído) Renomeado para `CreateItemPage` |
| `docs/adr/adr-03-linguagem-typescript.md` & `adr-03-typescript.md` | Dois ADRs com o mesmo número | (Concluído) Duplicidade não encontrada, `adr-03-typescript.md` não existe |

---

## 2. Testes inexistentes
- Repositório não possui testes (`*.test.tsx` ou pasta `__tests__`).
- `package.json` não define script `test`.
- **Resultado:** nenhuma verificação automatizada roda em CI ou local.

### Ação sugerida
Adicionar Vitest + React Testing Library, criar testes para hooks (`useItems`, `useItemMutations`) e componentes (`ItemsPage`, `ListPage`).

---

## 3. Code Smells
| Categoria | Local | Descrição | Sugestão |
|-----------|-------|-----------|----------|
| Dependência inexistente | `package.json` – `react-router-dom@^7.6.2` | Versão 7 ainda não lançada → instalação falha | (Concluído) Alterado para `^6.22.3` |
| Tratamento de erros | `api/item.ts` | Apenas `res.ok`; sem parsing de mensagem/retentativas | (Concluído) Propagado erros detalhados |
| `BASE_URL` vazio | `api/item.ts` | Se env não definido, chamadas quebram | (Concluído) Definido default explícito (`"/api"`) |
| Invalidação total | `useItemMutations.ts` | Sempre invalida `items`, causando refetch completo | (Concluído) Aplicado update otimista com `qc.setQueryData` |
| Contraste de cor | `ListPage.tsx` | `text-gray-100` em fundo claro | (Concluído) Usado `text-gray-900` |
| Acessibilidade | Botões toggle | Falta `aria-pressed` | (Concluído) Adicionado atributo |

---

## 4. Plano de Ação
### Curto Prazo
1. (Concluído) Corrigir versão do `react-router-dom` e reinstalar dependências.
2. (Concluído) Adicionar script `"test": "vitest run --coverage"` no `package.json`.
3. (Concluído) Configurar Vitest + RTL e criar testes básicos.
4. (Concluído) Refatorar `ItemsPage` (nome/propósito) e ajustar cores em `ListPage`.

### Médio Prazo
5. (Concluído) Melhorar tratamento de erros em `api/item.ts` (try/catch, mensagens específicas).
6. (Concluído) Implementar atualizações otimistas no React Query e `staleTime` apropriado.
7. Configurar CI (GitHub Actions) para lint, test e build.

### Longo Prazo
8. Cobertura de testes > 80 %, usando MSW para mocks.
9. Integrar OpenTelemetry Web para rastreamento de performance.
10. Revisar ADRs duplicados garantindo um arquivo por decisão.

---

## Próximos Passos
Após aplicar o plano de curto prazo, reavaliar métricas de qualidade (lint, testes, perf) e atualizar este documento no Memory Bank. 