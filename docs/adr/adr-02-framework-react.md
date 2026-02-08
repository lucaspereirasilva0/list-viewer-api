# ADR 02: Architecture Decision - Adoption of React as Frontend Framework

## WHAT IS THIS ADR?
This document records the architectural decision to use React as the main frontend development framework for the list management application.

## DETAILS
- **Context:** The project needs a modern, intuitive, and efficient user interface to allow management of shopping list items. The application must be a responsive Single Page Application (SPA) with Progressive Web App (PWA) capabilities and able to consume an existing Go REST API. The need was for a technology that offered a declarative approach and a robust ecosystem for building reusable UI components.
- **Decision:** It was decided to implement the frontend using React 18, together with TypeScript for typing, Vite as the build and development tool, React Query for server state management, and Tailwind CSS for styling. This choice aligns with the need for a declarative, modular, and high-performance user interface.
- **Considered Alternatives:** The provided architecture document (`frontend/ARQUITETURA_FRONTEND.md`) does not explicitly detail alternative frontend frameworks considered (e.g., Angular, Vue, Svelte) or the specific reasons for their rejection. The decision to use React is presented as fundamental to the project's current structure.
- **Consequences:**
    - **Positives:**
        - **Modularity and Reusability:** React's component-based approach allows the creation of reusable UI elements, speeding up development and improving maintainability.
        - **Declarative UI:** Facilitates interface development by focusing on "what" the UI should be, rather than "how" it should change.
        - **Rich Ecosystem:** Access to a vast ecosystem of libraries, tools, and large community support (e.g., React Query for asynchronous data management).
        - **Performance:** Efficient rendering of UI updates through its Virtual DOM.
    - **Negatives:**
        - **Learning Curve:** May present a learning curve for developers not familiar with React's specific paradigms (JSX, Hooks, state management).
        - **Build Tool Dependency:** Requires tools like Vite for JSX/TypeScript transpilation and application bundling.

## CHANGELOG
- `<!-- auto-filled by git -->` - Version 1.0 - Document initialization.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-XX-document-title.md` (where XX is a sequential number)
