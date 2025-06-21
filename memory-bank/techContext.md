# Technical Context: List Manager Frontend

## Technologies Used
- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **State Management (Server State):** React Query (TanStack Query 5)
- **PWA:** `vite-plugin-pwa`
- **Toast Notifications:** react-hot-toast
- **HTTP Client:** Native `fetch` API
- **Routing:** Utiliza `react-router-dom` para gerenciamento da rota raiz (`/`). A funcionalidade de criação e edição de itens foi integrada diretamente na `ListPage`, eliminando a necessidade de páginas separadas para criação e edição.
- **Linting:** ESLint
- **Formatting:** Prettier

## Development Setup
1.  **Node.js & npm:** Ensure Node.js (LTS version recommended) and npm are installed.
2.  **Project Clone:** Clone the frontend repository (or ensure the `frontend/` directory is present).
3.  **Install Dependencies:** Navigate to the `frontend/` directory and run `npm install`.
4.  **Start Development Server:** Run `npm run dev`. The application will be available at `http://localhost:5173` (or another port if 5173 is in use).
5.  **Environment Variables:** The backend API URL can be configured via `.env` file (e.g., `VITE_API_URL=http://localhost:8080`). If not set, it assumes relative pathing or a default.

## Technical Constraints
- **Backend Dependency:** Relies on the `/item` and `/items` REST endpoints from the Go backend.
- **No Authentication:** The current frontend iteration does not implement user authentication, aligning with the backend's current state.
- **Single Entity Focus:** Primarily deals with `Item` entities; `List` or `User` management is not in scope for this phase.

## Dependencies
- `@tanstack/react-query`
- `react`, `react-dom`
- `tailwindcss`, `autoprefixer`, `postcss`
- `typescript`, `@types/react`, `@types/react-dom`
- `@vitejs/plugin-react`, `vite`, `vite-plugin-pwa`
- `react-hot-toast`
- `eslint`, `eslint-config-prettier`, `eslint-plugin-react`

## Build and Deployment
- **Build Command:** `npm run build` (generates static assets in `dist/`).
- **Preview Build:** `npm run preview` (serves the production build locally).
- **PWA Output:** The build process generates `sw.js` (service worker) and `manifest.webmanifest` for PWA capabilities. 