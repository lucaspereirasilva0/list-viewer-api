# ADR 03: Architecture Decision - Adoption of TypeScript

## WHAT IS THIS ADR?
This document records the architectural decision to use TypeScript as the development language for the frontend of the list management application.

## DETAILS
- **Context:** The frontend application is a complex Single Page Application (SPA) that interacts with a REST API. The need was for a language that could offer greater robustness, early error detection, and better maintenance in a team environment, especially for a project with growing components and business logic. The `frontend/ARQUITETURA_FRONTEND.md` lists TypeScript as one of the main technologies, indicating its adoption from the start.
- **Decision:** It was decided to implement the frontend using TypeScript 5. This choice aims to bring static typing to JavaScript development, improving code quality, facilitating refactoring, and providing safer and more scalable development.
- **Considered Alternatives:** The architecture document does not specify explicit alternatives to TypeScript for the frontend language. The decision to use TypeScript is presented as fundamental to the project's current structure, implying that plain JavaScript was the implicit alternative and was rejected in favor of static typing benefits.
- **Consequences:**
    - **Positives:**
        - **Code Robustness:** Static typing helps identify errors at compile time, reducing bugs in production.
        - **Maintainability:** Facilitates code understanding by other developers and safe refactoring.
        - **Improved Productivity:** Development tools (IDEs) offer more accurate autocomplete and improved code navigation.
        - **Implicit Documentation:** Interfaces and types serve as a form of documentation of data contracts and functions.
        - **Scalability:** Essential for larger projects and teams with multiple developers, ensuring consistency.
    - **Negatives:**
        - **Learning Curve:** There may be a learning curve for developers not familiar with TypeScript.
        - **Additional Configuration:** Requires a transpilation process (managed by Vite in this project) and configuration files (`tsconfig.json`).
        - **Verbose:** The code can become more verbose due to the need to declare types.

## CHANGELOG
- `<!-- auto-filled by git -->` - Version 1.0 - Document initialization.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-XX-document-title.md` (where XX is a sequential number)
