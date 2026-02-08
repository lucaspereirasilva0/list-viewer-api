# ADR 01: Architecture Decision - Implementation of Progressive Web App (PWA) with Auto-Update

## WHAT IS THIS ADR?
This document records the architectural decision regarding the implementation of the frontend as a Progressive Web App (PWA) with auto-update capability.

## DETAILS
- **Context:** The frontend application aims to provide a rich user experience, including offline functionality and continuous updates. During development and monitoring, frequent 404 errors were observed on the backend for GET requests to the `/_app/version.json` endpoint. After investigation, it was verified that this request is an automatic call from the PWA's Service Worker, orchestrated by `vite-plugin-pwa` for auto-update verification purposes.

- **Decision:** It was decided to implement the frontend application as a Progressive Web App (PWA). For this, the `vite-plugin-pwa` plugin will be used in the frontend build process, with the `registerType: 'autoUpdate'` configuration activated. The `GET /_app/version.json` request is recognized as an expected side effect of the PWA's auto-update mechanism and will not be directly handled by the backend, unless there is an explicit future need to serve API version information through this route.

- **Considered Alternatives:**
    - **Not implementing PWA:** This alternative was rejected for removing offline capabilities and the enhanced user experience that PWA offers, sacrificing resilience and performance under variable network conditions.
    - **Disabling `autoUpdate` in PWA:** This alternative was rejected for requiring manual user intervention for updates, harming the experience and potentially leading to users running outdated application versions.
    - **Implementing a dedicated `/_app/version.json` endpoint in the backend:** Although technically possible, this alternative was rejected for adding unnecessary complexity to the backend, given that the PWA's auto-update mechanism handles 404 gracefully and there is no immediate need for the backend to provide specific version information through this route.

- **Consequences:**
    - **Positives:**
        - Improved user experience due to offline access, faster loading times, and native-like functionality.
        - Continuous and background application updates without requiring user intervention.
        - Increased user engagement due to the enhanced experience.
    - **Negatives:**
        - Continuous generation of 404 logs on the backend for the `/_app/version.json` route. This is a benign behavior, but may generate noise in monitoring logs if not understood.
        - Increased complexity in frontend build configuration due to PWA integration.
        - Need to properly manage cache strategies to avoid invalidation issues, although `vite-plugin-pwa` automates much of this.

## CHANGELOG
- [2024-07-29 10:00 UTC-3] - Version 1.0 - Document initialization.