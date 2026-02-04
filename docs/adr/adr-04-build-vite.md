# ADR 04: Architecture Decision - Adoption of Vite

## WHAT IS THIS ADR?
This document records the architectural decision to use Vite as the build tool and development server for the frontend of the list management application.

## DETAILS
- **Context:** The frontend project is a React + TypeScript application. The need was for a build tool that offered fast and efficient development, with a fast development server and support for the chosen technologies (React, TypeScript). The `frontend/ARQUITETURA_FRONTEND.md` lists Vite as one of the main technologies, highlighting its role as a "fast bundler and dev-server".
- **Decision:** It was decided to use Vite 5 as the main build tool. This choice is based on its ability to provide an extremely fast development server, thanks to its use of native ES Modules, and a production-optimized build process, in addition to having a robust plugin ecosystem that supports React and TypeScript, such as `vite-plugin-pwa` for PWA.
- **Considered Alternatives:** The architecture document does not explicitly mention alternatives to Vite (e.g., Webpack, Parcel, Create React App). However, the decision for Vite suggests a preference for performance and simplicity in configuration, in contrast to more complex or slower tools.
- **Consequences:**
    - **Positives:**
        - **Fast Initialization and Hot Module Replacement (HMR):** Vite offers instant development feedback, significantly improving the developer experience.
        - **Simple Configuration:** Vite's configuration (`vite.config.ts`) is generally more concise and easier to understand compared to other build tools.
        - **Production Optimization:** Generates optimized bundles for production, resulting in performant frontend applications.
        - **TypeScript and JSX Support:** Native and efficient integration with TypeScript and JSX, essential for the React project.
        - **Extensibility via Plugins:** The plugin system allows adding functionalities such as PWA (with `vite-plugin-pwa`).
    - **Negatives:**
        - **Familiarity:** Developers more accustomed to other build tools may need some time to adapt to the Vite ecosystem.
        - **Compatibility Issues (rare):** In very complex projects or with unconventional dependencies, compatibility challenges may arise, although they are rare.

## CHANGELOG
- `<!-- auto-filled by git -->` - Version 1.0 - Document initialization.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-XX-document-title.md` (where XX is a sequential number) 