import { useEffect } from "react";

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  isEnabled?: boolean;
}

/**
 * Hook customizado para gerenciar navegação por teclado globalmente.
 *
 * @param options - Objeto de configuração com callbacks para cada tecla
 * @param options.onEnter - Callback executado quando Enter é pressionado
 * @param options.onEscape - Callback executado quando Escape é pressionado
 * @param options.onTab - Callback executado quando Tab é pressionado
 * @param options.isEnabled - Se false, desativa a navegação (default: true)
 * @param dependencies - Array de dependências adicionais para re-executar o effect
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
 * @nota Este hook usa window.addEventListener globalmente. Se múltiplos
 * componentes usarem este hook simultaneamente, todos responderão aos eventos.
 * Para uso local, considere implementar versão com ref para elemento específico.
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
  }, [onEnter, onEscape, onTab, isEnabled, ...dependencies]);
}
