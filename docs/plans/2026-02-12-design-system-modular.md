# Design System Modular Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a modular Design System with reusable UI components, design tokens, animations, and improved accessibility for the list-viewer-api frontend.

**Architecture:** Create base UI components (Button, Input, Card, Badge, Spinner, IconButton) with consistent variants and sizes. Use Tailwind CSS tokens for colors, spacing, and animations. Refactor existing components to use the new design system.

**Tech Stack:** React 18, TypeScript 5, Tailwind CSS 3, Vitest 4, React Testing Library, clsx, tailwind-merge

---

## Task 1: Install Dependencies

**Files:**
- Modify: `frontend/package.json`

**Step 1: Install required dependencies**

```bash
cd frontend && npm install clsx@^2.1.0 tailwind-merge@^2.2.0 jest-axe@^8.0.0 --save-exact
```

**Step 2: Verify installation**

```bash
cd frontend && npm list clsx tailwind-merge jest-axe
```
Expected: All packages listed

**Step 3: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "deps: add clsx, tailwind-merge, jest-axe for design system"
```

---

## Task 2: Create Utility Function (cn)

**Files:**
- Create: `frontend/src/utils/cn.ts`
- Create: `frontend/src/utils/__tests__/cn.test.ts`

**Step 1: Write the failing test**

```typescript
// frontend/src/utils/__tests__/cn.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn', () => {
  it('Given_MergeNoConflict_When_Merging_Then_CombinesClasses', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('Given_MergeConflict_When_Merging_Then_TailwindTakesPrecedence', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('Given_ConditionalClasses_When_Merging_Then_IncludesTruthy', () => {
    expect(cn('base', true && 'active', false && 'inactive')).toBe('base active');
  });

  it('Given_UndefinedOrNull_When_Merging_Then_IgnoresThem', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- cn.test.ts
```
Expected: FAIL with "Cannot find module '../cn'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- cn.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/utils/cn.ts frontend/src/utils/__tests__/cn.test.ts
git commit -m "feat: add cn utility for merging Tailwind classes"
```

---

## Task 3: Create Design Tokens CSS

**Files:**
- Create: `frontend/src/styles/tokens.css`

**Step 1: Create tokens.css file**

```css
/* frontend/src/styles/tokens.css */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

:root {
  --animation-duration-fast: 150ms;
  --animation-duration-normal: 200ms;
  --animation-duration-slow: 300ms;
}
```

**Step 2: Update main.tsx to import tokens**

**File:** `frontend/src/main.tsx`
Add after other imports:
```typescript
import './styles/tokens.css';
```

**Step 3: Commit**

```bash
git add frontend/src/styles/tokens.css frontend/src/main.tsx
git commit -m "feat: add design tokens CSS with animations"
```

---

## Task 4: Update Tailwind Config with Design Tokens

**Files:**
- Modify: `frontend/tailwind.config.js`

**Step 1: Update tailwind.config.js**

Replace the entire `theme.extend` section with:

```javascript
// frontend/tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        success: {
          50: '#d1fae5',
          100: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fef3c7',
          100: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fee2e2',
          100: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
```

**Step 2: Run build to verify config**

```bash
cd frontend && npm run build
```
Expected: Build succeeds

**Step 3: Commit**

```bash
git add frontend/tailwind.config.js
git commit -m "feat: update Tailwind config with design tokens"
```

---

## Task 5: Create UI Types

**Files:**
- Create: `frontend/src/types/ui.ts`

**Step 1: Create ui.ts types file**

```typescript
// frontend/src/types/ui.ts

/** Button style variants */
export type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'ghost';

/** Component size options */
export type ComponentSize = 'sm' | 'md' | 'lg';

/** Card style variants */
export type CardVariant = 'default' | 'success' | 'danger' | 'warning' | 'info';

/** Card padding options */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/** Badge style variants */
export type BadgeVariant = 'active' | 'inactive' | 'pending' | 'success' | 'danger' | 'warning';

/** Spinner color options */
export type SpinnerColor = 'brand' | 'success' | 'danger' | 'white';

/** Base button props interface */
export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ComponentSize;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
```

**Step 2: Commit**

```bash
git add frontend/src/types/ui.ts
git commit -m "feat: add UI component types"
```

---

## Task 6: Create Button Component

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/__tests__/Button.test.tsx`

**Step 1: Write the failing tests**

```typescript
// frontend/src/components/ui/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('Given_PrimaryVariant_When_Rendering_Then_HasCorrectStyles', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-600', 'hover:bg-brand-700');
  });

  it('Given_LoadingState_When_Rendering_Then_ShowsSpinner', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Given_ClickAction_When_Clicking_Then_CallsOnClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Given_Disabled_When_Clicking_Then_DoesNotCallOnClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Given_LeftIcon_When_Rendering_Then_RendersIcon', () => {
    const Icon = () => <span data-testid="icon">I</span>;
    render(<Button leftIcon={<Icon />}>Save</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('Given_FullWidth_When_Rendering_Then_HasWFullClass', () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- Button.test.tsx
```
Expected: FAIL with "Cannot find module '../Button'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import type { ButtonVariant, ComponentSize } from '../../../types/ui';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500',
  success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
};

const sizeStyles: Record<ComponentSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, leftIcon, rightIcon, children, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
          'transition-all duration-200 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <span data-testid="spinner" className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- Button.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/components/ui/Button.tsx frontend/src/components/ui/__tests__/Button.test.tsx
git commit -m "feat: add Button component with variants"
```

---

## Task 7: Create IconButton Component

**Files:**
- Create: `frontend/src/components/ui/IconButton.tsx`
- Create: `frontend/src/components/ui/__tests__/IconButton.test.tsx`

**Step 1: Write the failing tests**

```typescript
// frontend/src/components/ui/__tests__/IconButton.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FaTrash } from 'react-icons/fa';
import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('Given_Rendering_Then_HasAriaLabel', () => {
    render(<IconButton icon={<FaTrash />} ariaLabel="Delete item" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Delete item');
  });

  it('Given_ClickAction_When_Clicking_Then_CallsOnClick', () => {
    const onClick = vi.fn();
    render(<IconButton icon={<FaTrash />} ariaLabel="Delete" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Given_DangerVariant_When_Rendering_Then_HasDangerStyles', () => {
    render(<IconButton icon={<FaTrash />} ariaLabel="Delete" variant="danger" />);
    expect(screen.getByRole('button')).toHaveClass('bg-danger-600');
  });

  it('Given_LgSize_When_Rendering_Then_HasMinTouchTarget', () => {
    render(<IconButton icon={<FaTrash />} ariaLabel="Delete" size="lg" />);
    const button = screen.getByRole('button');
    const styles = window.getComputedStyle(button);
    expect(parseInt(styles.height)).toBeGreaterThanOrEqual(44);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- IconButton.test.tsx
```
Expected: FAIL with "Cannot find module '../IconButton'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/components/ui/IconButton.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import type { ButtonVariant, ComponentSize } from '../../../types/ui';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: ButtonVariant;
  size?: ComponentSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white',
  success: 'bg-success-600 hover:bg-success-700 text-white',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700',
};

const sizeStyles: Record<ComponentSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ariaLabel, variant = 'ghost', size = 'md', disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg',
          'transition-all duration-200 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- IconButton.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/components/ui/IconButton.tsx frontend/src/components/ui/__tests__/IconButton.test.tsx
git commit -m "feat: add IconButton component"
```

---

## Task 8: Create Spinner Component

**Files:**
- Create: `frontend/src/components/ui/Spinner.tsx`
- Create: `frontend/src/components/ui/__tests__/Spinner.test.tsx`

**Step 1: Write the failing tests**

```typescript
// frontend/src/components/ui/__tests__/Spinner.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('Given_Default_When_Rendering_Then_HasCorrectClasses', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('animate-spin', 'border-2');
  });

  it('Given_BrandColor_When_Rendering_Then_HasBrandColor', () => {
    render(<Spinner color="brand" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('border-brand-600');
  });

  it('Given_LgSize_When_Rendering_Then_HasLgSize', () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- Spinner.test.tsx
```
Expected: FAIL with "Cannot find module '../Spinner'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/components/ui/Spinner.tsx
import { cn } from '../../../utils/cn';
import type { ComponentSize, SpinnerColor } from '../../../types/ui';

export interface SpinnerProps {
  size?: ComponentSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeStyles: Record<ComponentSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
};

const colorStyles: Record<SpinnerColor, string> = {
  brand: 'border-brand-600',
  success: 'border-success-600',
  danger: 'border-danger-600',
  white: 'border-white',
};

export function Spinner({ size = 'md', color = 'brand', className }: SpinnerProps) {
  return (
    <span
      data-testid="spinner"
      className={cn(
        'animate-spin border-current border-t-transparent rounded-full',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
    />
  );
}
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- Spinner.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/components/ui/Spinner.tsx frontend/src/components/ui/__tests__/Spinner.test.tsx
git commit -m "feat: add Spinner component"
```

---

## Task 9: Create Card Component

**Files:**
- Create: `frontend/src/components/ui/Card.tsx`
- Create: `frontend/src/components/ui/__tests__/Card.test.tsx`

**Step 1: Write the failing tests**

```typescript
// frontend/src/components/ui/__tests__/Card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('Given_Default_When_Rendering_Then_HasBaseClasses', () => {
    render(<Card>Content</Card>);
    const card = screen.getByText('Content').parentElement as HTMLElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
  });

  it('Given_SuccessVariant_When_Rendering_Then_HasSuccessBorder', () => {
    render(<Card variant="success">Content</Card>);
    const card = screen.getByText('Content').parentElement as HTMLElement;
    expect(card).toHaveClass('border-l-success-500');
  });

  it('Given_Hoverable_When_Rendering_Then_HasHoverClasses', () => {
    render(<Card hoverable>Content</Card>);
    const card = screen.getByText('Content').parentElement as HTMLElement;
    expect(card).toHaveClass('hover:shadow-lg', 'transition-all');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- Card.test.tsx
```
Expected: FAIL with "Cannot find module '../Card'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/components/ui/Card.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import type { CardVariant, CardPadding } from '../../../types/ui';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  padding?: CardPadding;
}

const variantBorders: Record<CardVariant, string> = {
  default: 'border-l-gray-300 dark:border-l-gray-600',
  success: 'border-l-success-500',
  danger: 'border-l-danger-500',
  warning: 'border-l-warning-500',
  info: 'border-l-brand-500',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, padding = 'md', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-white dark:bg-gray-800 rounded-lg shadow-md',
          // Border
          'border-l-4',
          variantBorders[variant],
          // Padding
          paddingStyles[padding],
          // Hoverable
          hoverable && 'hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- Card.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/components/ui/Card.tsx frontend/src/components/ui/__tests__/Card.test.tsx
git commit -m "feat: add Card component with variants"
```

---

## Task 10: Create Badge Component

**Files:**
- Create: `frontend/src/components/ui/Badge.tsx`
- Create: `frontend/src/components/ui/__tests__/Badge.test.tsx`

**Step 1: Write the failing tests**

```typescript
// frontend/src/components/ui/__tests__/Badge.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('Given_ActiveVariant_When_Rendering_Then_HasActiveStyles', () => {
    render(<Badge variant="active">Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge).toHaveClass('bg-success-100', 'text-success-700');
  });

  it('Given_DangerVariant_When_Rendering_Then_HasDangerStyles', () => {
    render(<Badge variant="danger">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-danger-100', 'text-danger-700');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- Badge.test.tsx
```
Expected: FAIL with "Cannot find module '../Badge'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/components/ui/Badge.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import type { BadgeVariant, ComponentSize } from '../../../types/ui';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: ComponentSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  active: 'bg-success-100 text-success-700 border border-success-200',
  inactive: 'bg-gray-100 text-gray-700 border border-gray-200',
  pending: 'bg-warning-100 text-warning-700 border border-warning-200',
  success: 'bg-success-100 text-success-700',
  danger: 'bg-danger-100 text-danger-700',
  warning: 'bg-warning-100 text-warning-700',
};

const sizeStyles: Record<ComponentSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'active', size = 'md', children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- Badge.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/components/ui/Badge.tsx frontend/src/components/ui/__tests__/Badge.test.tsx
git commit -m "feat: add Badge component"
```

---

## Task 11: Create Input Component

**Files:**
- Create: `frontend/src/components/ui/Input.tsx`
- Create: `frontend/src/components/ui/__tests__/Input.test.tsx'

**Step 1: Write the failing tests**

```typescript
// frontend/src/components/ui/__tests__/Input.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('Given_Value_When_Changing_Then_CallsOnChange', () => {
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('Given_Error_When_Rendering_Then_HasErrorStyles', () => {
    render(<Input value="" onChange={vi.fn()} error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-danger-500');
  });

  it('Given_Label_When_Rendering_Then_ShowsLabel', () => {
    render(<Input value="" onChange={vi.fn()} label="Name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- Input.test.tsx
```
Expected: FAIL with "Cannot find module '../Input'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, error, label, helperText, leftIcon, rightIcon, disabled, className, ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full px-4 py-2 rounded-lg border transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Enabled state
              !disabled && 'bg-white dark:bg-gray-800',
              // Disabled state
              disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
              // Error state
              error
                ? 'border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-brand-500',
              // Left icon padding
              leftIcon && 'pl-10',
              // Right icon padding
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- Input.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/components/ui/Input.tsx frontend/src/components/ui/__tests__/Input.test.tsx
git commit -m "feat: add Input component"
```

---

## Task 12: Create UI Components Barrel Export

**Files:**
- Create: `frontend/src/components/ui/index.ts`

**Step 1: Create index.ts**

```typescript
// frontend/src/components/ui/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Input } from './Input';
export type { InputProps } from './Input';
```

**Step 2: Commit**

```bash
git add frontend/src/components/ui/index.ts
git commit -m "feat: add UI components barrel export"
```

---

## Task 13: Create useTheme Hook

**Files:**
- Create: `frontend/src/hooks/useTheme.ts`
- Create: `frontend/src/hooks/__tests__/useTheme.test.ts`

**Step 1: Write the failing tests**

```typescript
// frontend/src/hooks/__tests__/useTheme.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('light', 'dark');
  });

  it('Given_Default_When_Rendering_Then_SetsLightTheme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement).toHaveClass('light');
  });

  it('Given_ToggleTheme_When_Calling_Then_TogglesBetweenLightAndDark', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement).toHaveClass('dark');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm test -- useTheme.test.ts
```
Expected: FAIL with "Cannot find module '../useTheme'"

**Step 3: Write minimal implementation**

```typescript
// frontend/src/hooks/useTheme.ts
import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    return stored || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}
```

**Step 4: Run test to verify it passes**

```bash
cd frontend && npm test -- useTheme.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/hooks/useTheme.ts frontend/src/hooks/__tests__/useTheme.test.ts
git commit -m "feat: add useTheme hook for dark mode"
```

---

## Task 14: Refactor ListItem to Use New Components

**Files:**
- Modify: `frontend/src/components/ListItem.tsx`

**Step 1: Read current ListItem implementation**

```bash
cat /Users/lucaspereira/Desktop/list-viewer-api/frontend/src/components/ListItem.tsx
```

**Step 2: Refactor ListItem to use Button, IconButton, Card**

Replace existing button implementations with new UI components. The refactored component should:

1. Use `Card` component as container with variant based on item active status
2. Use `IconButton` for edit, delete, and toggle actions
3. Use `Button` for save/cancel actions
4. Keep all existing functionality (contentEditable, handlers, etc.)

**Expected changes:**
- Replace inline button styles with Button/IconButton components
- Add fade-in animation when item is first rendered
- Use Card variant 'success' for active items, 'default' for inactive

**Step 3: Run existing tests to ensure no regression**

```bash
cd frontend && npm test -- ListItem.test.tsx
```
Expected: PASS (4 tests)

**Step 4: Commit**

```bash
git add frontend/src/components/ListItem.tsx
git commit -m "refactor: ListItem to use Design System components"
```

---

## Task 15: Update ItemSkeleton with Shimmer Effect

**Files:**
- Modify: `frontend/src/components/ItemSkeleton.tsx`

**Step 1: Read current ItemSkeleton implementation**

```bash
cat /Users/lucaspereira/Desktop/list-viewer-api/frontend/src/components/ItemSkeleton.tsx
```

**Step 2: Update ItemSkeleton to use shimmer animation**

Replace static gray background with animated shimmer effect:

```tsx
className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
```

**Step 3: Run tests to verify**

```bash
cd frontend && npm test
```
Expected: PASS

**Step 4: Commit**

```bash
git add frontend/src/components/ItemSkeleton.tsx
git commit -m "feat: add shimmer effect to ItemSkeleton"
```

---

## Task 16: Update ListPage Header and Empty State

**Files:**
- Modify: `frontend/src/pages/ListPage.tsx`

**Step 1: Read current ListPage implementation**

```bash
cat /Users/lucaspereira/Desktop/list-viewer-api/frontend/src/pages/ListPage.tsx
```

**Step 2: Update header with improved styling**

Add subtle gradient background to header:
```tsx
className="bg-gradient-to-r from-brand-50 to-transparent dark:from-gray-800"
```

**Step 3: Improve empty state**

Add prominent CTA button to empty state:
```tsx
<Button variant="primary" size="lg" onClick={handleAddFirstItem}>
  Adicionar Primeiro Item
</Button>
```

**Step 4: Run tests**

```bash
cd frontend && npm test
```
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/pages/ListPage.tsx
git commit -m "feat: improve ListPage header and empty state"
```

---

## Task 17: Run All Tests and Verify

**Step 1: Run all tests**

```bash
cd frontend && npm test
```
Expected: All tests pass (current baseline: 6 tests, more after UI component tests)

**Step 2: Run linting**

```bash
cd frontend && npm run lint
```
Expected: No errors

**Step 3: Build frontend**

```bash
cd frontend && npm run build
```
Expected: Build succeeds

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: finalize Design System implementation"
```

---

## Task 18: Clean Up Design Document

**Step 1: Move design doc to appropriate location**

```bash
git mv docs/plans/2026-02-12-design-system-modular-design.md docs/design-system.md
```

**Step 2: Commit**

```bash
git add docs/design-system.md
git commit -m "docs: move design doc to docs/design-system.md"
```

---

## Completion Criteria

- [ ] All UI components created with tests
- [ ] ListItem refactored to use new components
- [ ] ItemSkeleton has shimmer effect
- [ ] ListPage has improved header and empty state
- [ ] All tests pass
- [ ] Linting passes
- [ ] Build succeeds
- [ ] No TypeScript errors
