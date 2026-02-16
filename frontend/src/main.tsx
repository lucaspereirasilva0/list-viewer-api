import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/ThemeProvider";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="list-viewer-theme">
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
