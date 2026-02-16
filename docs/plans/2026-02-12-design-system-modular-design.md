# Design System Modular - Design Document

**Date:** 2026-02-12
**Author:** Claude Opus
**Status:** Approved
**Type:** Design System Refactoring

---

## Overview

Implement a modular Design System for the list-viewer-api frontend, creating reusable UI components with consistent styling, improved accessibility, and enhanced user experience through micro-interactions and animations.

---

## Architecture

```
frontend/src/
├── components/
│   ├── ui/                           # NEW: Design System Base
│   │   ├── Button.tsx                # Button with variants (primary, success, danger, warning, ghost)
│   │   ├── Input.tsx                  # Reusable input with states
│   │   ├── IconButton.tsx            # Icon-only button
│   │   ├── Card.tsx                   # Container with shadow and border
│   │   ├── Badge.tsx                  # Status badges
│   │   ├── Spinner.tsx                # Loading states
│   │   ├── __tests__/               # UI component tests
│   │   └── index.ts                   # Barrel exports
│   ├── ListItem.tsx                  # EXISTING: refactor to use UI components
│   ├── ErrorBanner.tsx               # EXISTING: keep as-is
│   └── ItemSkeleton.tsx              # EXISTING: refactor with shimmer
├── styles/
│   └── tokens.css                    # NEW: CSS custom properties for design tokens
├── hooks/
│   ├── useTheme.ts                   # NEW: Theme utilities (dark/light mode)
│   └── useKeyboardNavigation.ts      # EXISTING: keep as-is
├── types/
│   └── ui.ts                         # NEW: UI component types
└── utils/
    └── cn.ts                         # NEW: clsx/cn utility for classes
```

**Principles:**
1. **Component-first**: Each UI component is independent
2. **Composition over Configuration**: Compose components, don't configure everything
3. **Accessibility-first**: WAI-ARIA attributes on all components
4. **Type Safety**: TypeScript strict types for all props

---

## Design Tokens

### Color Tokens

```js
// tailwind.config.js
colors: {
  // Brand colors (primary actions)
  brand: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
    300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6',
    600: '#2563eb',  // default primary
    700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a',
    950: '#172554',
  },
  // Semantic colors
  success: { 500: '#10b981', 600: '#059669' },
  warning: { 500: '#f59e0b', 600: '#d97706' },
  danger:  { 500: '#ef4444', 600: '#dc2626' },
  info:    { 500: '#3b82f6', 600: '#2563eb' },
}
```

### Border Radius Tokens

```js
borderRadius: {
  'sm': '6px',  'md': '8px',   // default
  'lg': '12px', 'xl': '16px',
}
```

### Animation Tokens

```js
animation: {
  'fade-in': 'fadeIn 0.2s ease-out',
  'slide-down': 'slideDown 0.3s ease-out',
  'scale-in': 'scaleIn 0.15s ease-out',
  'shimmer': 'shimmer 2s infinite',
}
```

---

## UI Components

### Button Component

```tsx
interface ButtonProps {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

**Variants:**
- `primary`: Ação principal (bg-brand-600)
- `success`: Confirmação (bg-success-600)
- `danger`: Destrutivo (bg-danger-600)
- `warning`: Atenção (bg-warning-600)
- `ghost`: Sem fundo (hover:bg-gray-100)

**Sizes:**
- `sm`: h-8 px-3 text-sm (desktop)
- `md`: h-10 px-4 text-base (default)
- `lg`: h-12 px-6 text-lg (mobile-friendly, min 44px)

**Features:**
- `loading` state with Spinner
- `disabled` with opacity-50 + cursor-not-allowed
- `fullWidth` for w-full
- `active:scale-95` for tactile feedback
- Smooth transitions on all states

### IconButton Component

```tsx
interface IconButtonProps {
  icon: React.ReactNode
  ariaLabel: string
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  tooltip?: string
}
```

**Sizes (min 44x44px for mobile):**
- `sm`: h-9 w-9 (36px - desktop only)
- `md`: h-11 w-11 (44px - mobile friendly)
- `lg`: h-14 w-14 (56px - large touch targets)

### Input Component

```tsx
interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  disabled?: boolean
  error?: string
  label?: string
  helperText?: string
  required?: boolean
  autoFocus?: boolean
  maxLength?: number
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

**Visual States:**
```
Default: border-gray-300 focus:ring-brand-500
Error:   border-danger-500 focus:ring-danger-500
Disabled: bg-gray-100 text-gray-500
```

### Card Component

```tsx
interface CardProps {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info'
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}
```

**Variant Borders:**
- `default`: border-l-gray-300
- `success`: border-l-success-500
- `danger`: border-l-danger-500
- `warning`: border-l-warning-500
- `info`: border-l-brand-500

**Features:**
- `hoverable`: hover:shadow-lg + scale-[1.01]
- Padding variants: none, sm(p-3), md(p-4), lg(p-6)
- Border-l-4 color-coded
- Rounded-lg

### Badge Component

```tsx
interface BadgeProps {
  variant?: 'active' | 'inactive' | 'pending' | 'success' | 'danger' | 'warning'
  children: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}
```

### Spinner Component

```tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'brand' | 'success' | 'danger' | 'white'
  className?: string
}
```

---

## Hooks

### useTheme Hook

```tsx
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return { theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }
}
```

---

## Animations

```css
/* styles/tokens.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Dark Mode

```js
colors: {
  background: {
    light: '#ffffff',
    dark: '#0f172a',  // slate-900
  },
  surface: {
    light: '#f8fafc',  // slate-50
    dark: '#1e293b',  // slate-800
  }
}
```

---

## Micro-interactions

- Buttons: `active:scale-95` + `transition-all duration-200`
- Cards: `hover:scale-[1.02]` + `transition-transform`
- Inputs: `focus:ring-2 focus:ring-brand-500`
- Toast notifications with role="status"
- Fade-in animation when adding items

---

## Accessibility

- Focus rings visible on all interactive elements (`ring-2 ring-offset-2`)
- ARIA labels on all icon buttons
- Keyboard navigation documented
- Live regions for dynamic updates
- Min 44x44px touch targets for mobile

---

## TypeScript Types

All UI components have strict TypeScript types defined in `types/ui.ts`.

---

## Dependencies

```json
{
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "jest-axe": "^8.0.0"
  }
}
```

---

## Implementation Roadmap

### Phase 1: Design System Foundation
1. Update tailwind.config.js with tokens
2. Create styles/tokens.css with animations
3. Create utils/cn.ts
4. Create types/ui.ts
5. Install dependencies: clsx, tailwind-merge

### Phase 2: Base Components
6. Create Button.tsx + tests
7. Create IconButton.tsx + tests
8. Create Spinner.tsx + tests
9. Create Card.tsx + tests
10. Create Badge.tsx + tests
11. Create Input.tsx + tests

### Phase 3: Hooks and Utilities
12. Create hooks/useTheme.ts
13. Update App.tsx with theme toggle

### Phase 4: Refactor Existing Components
14. Refactor ListItem.tsx (use Button, IconButton, Card)
15. Update ItemSkeleton.tsx (shimmer effect)
16. Refactor ListPage.tsx (header, empty state)

### Phase 5: Polish and UX
17. Add micro-interactions (scale, fade-in)
18. Improve toast notifications
19. Add keyboard shortcuts help
20. Optimize mobile experience

### Phase 6: Final Testing
21. Run all tests
22. Verify accessibility
23. Test dark mode
24. Commit and merge

---

## Validation Checklist

Before committing:
- [ ] All unit tests pass
- [ ] Accessibility tests pass (jest-axe)
- [ ] Dark mode works correctly
- [ ] Mobile responsive (test on mobile viewport)
- [ ] Linting passes (npm run lint)
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Focus rings visible on all elements
- [ ] ARIA labels present on icon buttons
