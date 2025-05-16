import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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
          <ToastContainer position="top-right" autoClose={3000} />
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </LocationProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
