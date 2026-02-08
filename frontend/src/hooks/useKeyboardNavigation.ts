import { useEffect } from "react";

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  isEnabled?: boolean;
}

/**
 * Custom hook to manage keyboard navigation globally.
 *
 * @param options - Configuration object with callbacks for each key
 * @param options.onEnter - Callback executed when Enter is pressed
 * @param options.onEscape - Callback executed when Escape is pressed
 * @param options.onTab - Callback executed when Tab is pressed
 * @param options.isEnabled - If false, disables navigation (default: true)
 * @param dependencies - Array of additional dependencies to re-run the effect
 *
 * @example
 * ```ts
 * useKeyboardNavigation({
 *   onEnter: () => handleSubmit(),
 *   onEscape: () => handleCancel(),
 *   isEnabled: isModalOpen,
 * }, [isModalOpen]);
 * ```
 *
 * @note This hook uses window.addEventListener globally. If multiple
 * components use this hook simultaneously, all will respond to events.
 * For local usage, consider implementing a version with ref for a specific element.
 */
export function useKeyboardNavigation(
  options: KeyboardNavigationOptions,
  dependencies: readonly unknown[] = [],
) {
  const { onEnter, onEscape, onTab, isEnabled = true } = options;

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          onEnter?.();
          break;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          break;
        case "Tab":
          e.preventDefault();
          onTab?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEnter, onEscape, onTab, isEnabled, ...dependencies]);
}
