import { createContext } from "react";
import type { ThemeContextType } from "../types/theme";

const initialState: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
};

export const ThemeProviderContext =
  createContext<ThemeContextType>(initialState);
