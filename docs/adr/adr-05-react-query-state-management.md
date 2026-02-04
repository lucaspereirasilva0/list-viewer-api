# ADR 05: Architecture Decision - Adoption of React Query

## WHAT IS THIS ADR?
This document records the architectural decision to use `@tanstack/react-query` (formerly React Query) for server state management, asynchronous data caching, and synchronization in the frontend of the list management application.

## DETAILS
- **Context:** The frontend application needs an efficient and robust way to fetch, cache, synchronize, and update data from the server (the Go REST API). Managing asynchronous state directly in React can lead to complexities like loading states, errors, refetching, and manual cache invalidation. The document `frontend/ARQUITETURA_FRONTEND.md` highlights React Query as a "Cache/async fetch library" and describes how it is used in the hooks in `src/queries/`.
- **Decision:** It was decided to integrate `@tanstack/react-query` to handle all asynchronous data interactions. This choice aims to simplify server state management, optimize application performance through intelligent caching, and automate tasks like data revalidation and handling concurrent requests.
- **Considered Alternatives:** The architecture document does not specify explicit alternatives to React Query for server state management (e.g., SWR, Apollo Client/Relay for GraphQL, Redux-Saga/Thunk with manual fetch). The decision for React Query is presented as fundamental to how data is consumed and managed in the application, suggesting a preference for a dedicated and optimized solution for REST server data.
- **Consequences:**
    - **Positives:**
        - **Code Simplification:** Reduces the need for boilerplate to manage loading, error, and data states in components.
        - **Caching and Performance:** Automatic caching and revalidation strategies improve UI performance and reduce the number of unnecessary API requests.
        - **Enhanced Developer Experience:** Offers powerful and intuitive hooks (`useQuery`, `useMutation`) that facilitate interaction with remote data.
        - **Automatic Optimizations:** Automatically handles data revalidation on window focus, retry of failed requests, and deduping of duplicate requests.
        - **Cache Invalidation:** The `invalidateQueries` functionality ensures that the UI reflects the latest server state after mutations.
    - **Negatives:**
        - **Learning Curve:** Requires an understanding of React Query's specific concepts (queries, mutations, cache keys).
        - **Abstraction:** Although beneficial, the abstraction can, in rare cases, make debugging complex problems a bit more challenging if the developer doesn't understand the internal workings.
        - **Dependency Size:** Adds a dependency to the application, though it is optimized for what it offers.

## CHANGELOG
- `<!-- auto-filled by git -->` - Version 1.0 - Document initialization.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-XX-document-title.md` (where XX is a sequential number)
