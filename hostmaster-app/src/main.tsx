import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./i18n"; // Importamos la configuración de idiomas
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocationProvider } from "./context/LocationContext";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <LocationProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </LocationProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
