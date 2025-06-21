# Arquitetura do Front-end

> Última atualização: <!-- preenchido automaticamente pelo git -->

## Visão Geral

Este front-end é uma aplicação **React + TypeScript** construída com **Vite**. O objetivo é oferecer uma interface simples para gerenciar uma **lista de compras** consumindo uma API REST.  
A aplicação segue uma estrutura enxuta e modular, aproveitando **React Query** para gerenciamento de dados assíncronos e **Tailwind CSS** para estilização utilitária.

### Principais Tecnologias

| Tecnologia | Função |
|------------|--------|
| [React](https://react.dev/) | Biblioteca de UI declarativa |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vitejs.dev/) | Empacotador e dev-server veloz |
| [@tanstack/react-query](https://tanstack.com/query/latest) | Cache/ fetch assíncrono |
| [Tailwind CSS](https://tailwindcss.com/) | CSS utilitário |
| [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/) | Geração de PWA (manifest, icons, offline) |

---

## Estrutura de Diretórios Simplificada

```
frontend/
├─ index.html          # HTML de entrada carregado pelo Vite
├─ package.json        # Dependências e scripts npm
├─ vite.config.ts      # Configuração Vite + PWA
├─ tailwind.config.js  # Configuração Tailwind
├─ postcss.config.js   # Pipeline PostCSS
└─ src/
   ├─ main.tsx         # Ponto de entrada React
   ├─ App.tsx          # Componente raiz
   ├─ index.css        # Importa diretivas @tailwind
   ├─ api/             # Serviços HTTP isolados
   │   └─ item.ts      # CRUD de itens
   ├─ queries/         # Hooks React Query
   │   ├─ useItems.ts          # GET /items
   │   └─ useItemMutations.ts  # POST / PUT / DELETE
   ├─ components/
   │   ├─ ErrorBanner.tsx    # Banner de erro visual
   │   ├─ ItemSkeleton.tsx   # Skeleton loader para itens
   │   └─ ListItem.tsx       # Componente para renderizar um único item da lista
   └─ pages/
       └─ ListPage.tsx # Página principal (lista + formulário)
```

---

## Fluxo de Execução

1. **`index.html`** contém um `<div id="root">` vazio e importa o bundle `src/main.tsx`.
2. **`main.tsx`** cria um `QueryClient` (cache do React Query) e renderiza `<App>` dentro de `<QueryClientProvider>`.
3. **`App.tsx`** atualmente é um componente fino que apenas delega para `<ListPage />`.
4. **`ListPage.tsx`**:
   - Busca a lista de itens via **`useItems`**.
   - Possui `useCreateItem`, `useDeleteItem`, `useToggleItem` para mutações.
   - Renderiza o formulário de criação e a lista.
5. Hooks em **`queries/`** orquestram chamadas HTTP definidas em **`api/item.ts`** e invalidam o cache quando necessário.
6. Estilos são aplicados por classes **Tailwind** presentes nos JSX.

---

## Detalhamento dos Módulos

### 1. `src/main.tsx`
Responsável por:
- Criar o *root* React com `ReactDOM.createRoot`.
- Instanciar `QueryClient` e prover contexto global do React Query.
- Importar CSS base (`index.css`).

```tsx
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  )
```

### 2. `src/App.tsx`
Camada fininha que centraliza roteamento ou *layout* global (no futuro). Hoje apenas:
```tsx
function App() {
  return <ListPage />
}
```

### 3. `src/pages/ListPage.tsx`
Componente de página que incorpora UI + lógica de domínio:
- **Leitura**: `useItems` devolve `data`, `isLoading` etc.
- **Criação**: `useCreateItem` cria um item e depois invalida a query `items` para recarregar.
- **Toggle**: `useToggleItem` muda o estado `active`.
- **Exclusão**: `useDeleteItem` remove item.
- Usa `useState` para controlar o texto do input.
- Delega a renderização de cada item individual para o componente `<ListItem />`.

### 4. API – `src/api/item.ts`
Camada de acesso remoto isolada de UI:
- Exporta interface `Item`.
- Funções `listItems`, `createItem`, `deleteItem`, `toggleItem` – cada uma faz `fetch` para rotas REST.
- End-point base vem de `import.meta.env.VITE_API_URL` permitindo configuração por variável ambiente no Vite.

### 5. Data Hooks – `src/queries/`
Abstrações sobre React Query:
- **`useItems`** → `useQuery(['items'], listItems)`.
- **`useItemMutations`** exporta três hooks de `useMutation` que invocam funções de API e, em `onSuccess`, chamam `qc.invalidateQueries({queryKey:['items']})` – faz *cache-invalid* para refetch automático.

### 6. Estilização
- Arquivo `src/index.css` importa diretivas Tailwind `@tailwind base; components; utilities;`.
- `tailwind.config.js` limita *purge* aos arquivos de projeto, mantendo bundle enxuto.

### 7. Configurações de Build
- **`vite.config.ts`** adiciona plugin React e `vite-plugin-pwa` para transformar o app em PWA (manifest, icons, service worker auto-update).
- **`postcss.config.js`** habilita Tailwind + autoprefixer.
- **`tsconfig.json`** define compilação *strict*.

---

## Como Rodar Localmente

```bash
cd frontend
npm install          # ou pnpm / yarn
npm run dev          # inicia Vite em modo desenvolvimento
```

Variáveis de ambiente podem ser definidas num arquivo `.env` (Vite carrega automaticamente):
```
VITE_API_URL=http://localhost:8080
```

No primeiro uso, Vite abrirá `http://localhost:5173`.

### Build de Produção
```
npm run build   # gera arquivos estáticos em dist/
```

### Pré-visualizar Build
```
npm run preview
```

---

## Próximos Passos Sugestões de Estudo

1. **React Router** para múltiplas páginas e navegação.
2. **Composição de Componentes** maiores: extrair `<ItemCard>` etc.
3. **Testes** com `Jest + React Testing Library`.
4. **CI/CD**: configurar pipeline de lint, test, build.
5. **Theme Switcher**: aproveitar o `dark:` do Tailwind para alternar tema.

---

> Esperamos que esta documentação torne mais claro o funcionamento de cada módulo. Sinta-se livre para abrir *issues* ou PRs com melhorias! 