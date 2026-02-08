# ADR 07: Architecture Decision – Visual Error Feedback with react-hot-toast and ErrorBanner

## WHAT IS THIS ADR?
This record documents the technical decision on how to provide visual error feedback to the user in the frontend application. It covers the choice of toast library, creation of an error banner component, and the general display pattern.

## DETAILS
- **Context:** The roadmap (`docs/nextSteps.md`) defines the need to improve error handling, displaying clear and non-intrusive messages. The frontend already handles exceptions through React Query, but lacked a UI layer to communicate them to the user.
- **Decision:**
  1. **Toasts for mutations:** Adopt the **react-hot-toast** library to present temporary notifications when mutation operations (create, update, delete) fail. The `<Toaster>` component was added globally in `src/main.tsx` (position `top-right`, default duration 4s).
  2. **Banner for listing:** Create a lightweight component **`ErrorBanner.tsx`** using Tailwind to display a persistent alert when the initial listing query fails (critical loading failure).
  3. **Integration:** `useItemMutations.ts` now uses `toast.error()` in `onError`; `ListPage.tsx` uses `<ErrorBanner>` for error from `useItems`.
- **Considered Alternatives:**
  - **react-toastify:** More complete, but larger (≈ 20 KB gzip) and requires external CSS.
  - **Radix UI / Headless UI + custom component:** Requires more code and maintenance time.
  - **Custom implementation only with Tailwind and `setTimeout`:** Simple, but reinvents the wheel and lacks built-in accessibility.
  - **Only inline banners:** Less intrusive, but not scalable for multiple simultaneous actions.
- **Consequences:**
  - **Positives:**
    - *User Experience:* Immediate and clear feedback about failures without interrupting flow.
    - *Small Bundle:* `react-hot-toast` (~4 KB gzip) does not significantly impact final size.
    - *Accessibility:* Library provides appropriate ARIA attributes; the banner uses `role="alert"`.
    - *Consistency:* Single pattern for all mutations and listings.
  - **Negatives:**
    - *Extra Dependency:* New package to be maintained and updated.
    - *Potential Style Conflict:* If global CSS changes, it may be necessary to adjust banner's Tailwind classes.
    - *Internationalization:* Messages need to be centralized in a future i18n system.

## CHANGELOG
- `<!-- auto-filled by git -->` – Version 1.0 – Document initialization.

## FILE AND DIRECTORY CONVENTION
- **Directory:** `root_project/docs/adr/`
- **Filename:** `adr-07-feedback-visual.md` (sequential number after ADR 06)
