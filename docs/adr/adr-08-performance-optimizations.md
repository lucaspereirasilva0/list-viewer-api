# ADR 08: Architecture Decision - Performance Optimizations

## WHAT IS THIS ADR?
This document records the architectural decisions made to optimize the performance of the frontend of the shopping list management application, including React rendering improvements, API refactoring, and accessibility enhancements.

## DETAILS
- **Context:** The frontend of the shopping list application presented opportunities for performance optimization and code refactoring. Analyses identified that item sorting was recalculated on every render, event handlers were recreated unnecessarily, and there was no adequate component memoization.

- **Decision:** We implemented a comprehensive set of optimizations focused on:
  1. React performance using optimizer hooks
  2. API refactoring to eliminate duplication
  3. UX and accessibility improvements
  4. Automated test coverage

- **Considered Alternatives:**
  - **Keep code as it was:** Rejected as it caused unnecessary re-renders and degraded performance on larger lists.
  - **Use global state management library (Redux/Zustand):** Considered but rejected since React Query already adequately manages server state.
  - **Implement list virtualization (react-window):** Considered for very large lists, but deferred as the implemented optimizations were sufficient for the current use case.

- **Consequences:**
    - **Positives:**
        - **Better Performance:** `useMemo` on sorting avoids unnecessary recalculations, `useCallback` stabilizes function references, and `React.memo` prevents ListItem re-renders.
        - **More Maintainable Code:** Centralization of HTTP configuration in `client.ts` eliminates duplication and facilitates maintenance.
        - **Improved UX:** Max-width on container and responsive empty state improve the experience on large screens.
        - **Greater Accessibility:** `useKeyboardNavigation` hook and color contrast analysis ensure better keyboard navigation support and reading.
        - **Code Confidence:** Automated tests with Vitest and React Testing Library validate component behavior.
    - **Negatives:**
        - **Slightly Increased Complexity:** Use of additional hooks (useMemo, useCallback) requires proper understanding.
        - **More Files:** Creation of new files (client.ts, hooks, tests) increases code surface.
        - **Learning Curve:** New developers need to understand the optimization decisions made.

## IMPLEMENTATION

### 1. React Performance Hooks
- **useMemo:** Memoization of item sorting (`ListPage.tsx:102-113`)
- **useCallback:** Stabilization of event handlers (`ListPage.tsx:55-100`)
- **React.memo:** Memoization of ListItem component (`ListItem.tsx:22`)

### 2. API Refactoring
- **Function unification:** Removed duplicated `toggleItem` function, keeping only `updateItem` (`item.ts:53-68`)
- **HTTP Centralization:** Created `client.ts` for centralized header and request configuration

### 3. UX Improvements
- **Max-width:** Container with `max-w-2xl` for better readability on large screens (`ListPage.tsx:116`)
- **Responsive empty state:** Replaced `h-screen` with `min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh]` (`ListPage.tsx:195`)
- **Smooth transitions:** Added transition classes to interactive elements

### 4. Accessibility
- **Navigation hook:** Created `useKeyboardNavigation.ts` to globally manage keyboard events
- **Contrast analysis:** Document in `docs/accessibility/contrast-analysis.md` validates colors against WCAG AA
- **Aria labels:** Buttons have appropriate `aria-label` and `aria-pressed` attributes

### 5. Testing
- **Component tests:** `ListItem.test.tsx` validates rendering, states, and interactions
- **API tests:** `client.test.ts` validates HTTP configuration and headers
- **Configuration:** Vitest configured in `vite.config.ts:40-44`

## CHANGELOG
- `2026-02-03` - Version 1.0 - Document initialization. Registration of implemented performance optimizations.

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
