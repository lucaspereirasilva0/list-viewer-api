# Next Steps: List Manager Frontend

## 1. Testing: Implement unit and integration tests

**Objective:** Ensure code robustness, identify bugs early, and facilitate future modifications.

*   **Unit Tests:**
    *   **Where:** Focus on isolated components (presentation components), custom hooks (like `useItems`, `useItemMutations`), and API service functions (`frontend/src/api/item.ts`).
    *   **How:**
        *   For React components: Use `@testing-library/react` to render components and simulate user interactions.
        *   For hooks and API functions: Mock network calls. A good practice is to use [Mock Service Worker (MSW)](https://mswjs.io/) to intercept HTTP requests at the network level, making tests closer to the real environment.
        *   Use the **table-driven tests** pattern to test different scenarios and function inputs efficiently.
        *   Ensure all exported functions, especially those with business logic or API interaction, have test coverage.

*   **Integration Tests:**
    *   **Where:** Focus on the interaction between components and React Query hooks, ensuring data flow from UI to API and vice versa works correctly.
    *   **How:**
        *   Still use MSW to mock API responses, but test the complete behavior of a page (e.g., `ItemsPage.tsx`) when adding an item, toggling its status, or deleting it.
        *   Verify that React Query is invalidating and refetching data correctly after mutations.

## 2. Error Handling: Improve error messages and user feedback

**Objective:** Provide a more friendly and informative experience in case of failures.

*   **Visual Feedback:**
    *   Implement visible error messages for the user. These can be `toasts` (temporary notifications), banners at the top of the screen, or inline error messages (`<p>` error) next to form fields.
    *   When an API error occurs, capture it with React Query's `onError` and display a relevant message (e.g., "Failed to load items", "Unable to add item").

*   **Observability (Frontend):**
    *   Consider integrating a frontend error monitoring tool like [Sentry](https://sentry.io/welcome/) or configuring [OpenTelemetry Web](https://opentelemetry.io/docs/instrumentation/js/getting-started/browser/) for error tracking and performance metrics.
    *   Capture and log network errors, API errors, and JavaScript runtime errors with sufficient details for debugging.

## 3. UI/UX Refinements: Improve loading states, empty states, and responsiveness

**Objective:** Make the application more fluid, intuitive, and pleasant to use.

*   **Loading States:**
    *   When fetching data from the API, display loading indicators. This can be a generic `spinner`, or better, `skeleton loaders` that simulate the structure of the content being loaded, giving a sense of speed.
    *   Use React Query hook properties `isLoading` and `isFetching`.

*   **Empty States:**
    *   When there are no items in the list, display a clear message informing this (e.g., "No items found. Add the first item!") and perhaps a button or icon inviting the user to add a new item.

*   **Responsiveness:**
    *   Review the application layout on different screen sizes (especially mobile) using Tailwind CSS utility classes.
    *   Test the application in mobile emulators in the browser and, if possible, on real devices to ensure a consistent experience.
    *   Ensure interactive elements (buttons, input fields) are easily clickable/touchable on small screens.

## 4. Filtering/Search: Add basic client-side filtering

**Objective:** Allow users to manage larger lists more easily.

*   **Filter by Status:**
    *   Add buttons or a dropdown to filter items by status (e.g., "All", "Active", "Inactive").
    *   Filtering logic will be on the frontend, operating on the already loaded list of items.

*   **Search Bar:**
    *   Implement an input field where the user can type and filter items by name or description.
    *   Consider implementing a `debounce` for the search field to avoid filtering being executed on each typed character, improving performance.

## 5. Offline Sync: Implement more robust offline capabilities

**Objective:** Improve the PWA experience, allowing operations even without immediate connection.

*   **Optimistic Updates:**
    *   For operations like adding, toggling status, or deleting an item, update the UI immediately as if the operation was successful, even before receiving the backend response.
    *   If the API call fails, revert the change in the UI and display an error message. React Query has native support for this with the `onMutate` option.

*   **Background Sync (PWA - more advanced):**
    *   For scenarios where the user attempts an operation without connection and you want it to be automatically retried when the connection returns, explore the [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API) or use [Workbox](https://developer.chrome.com/docs/workbox/) resources (part of `vite-plugin-pwa`) to queue failed requests and re-execute them offline.
