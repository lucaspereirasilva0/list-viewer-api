import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "./useTheme";

export function ThemeToggle() {
  const { setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    if (actualTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        actualTheme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
      }
      className="p-3 bg-primary text-white rounded-soft shadow-soft hover:shadow-elegant hover:scale-[1.02] transition-all duration-200 ease-out"
      title={
        actualTheme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
      }
    >
      {actualTheme === "light" ? (
        <FaMoon className="w-5 h-5" />
      ) : (
        <FaSun className="w-5 h-5" />
      )}
    </button>
  );
}
