import axios from "axios";

// URL base del backend
const baseUrl = import.meta.env.VITE_SERVER_URL; 

// Token (puedes cargarlo desde localStorage o variables de entorno si es dinámico)
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc0NzcwMDk0N30.tei23TJR-BWSgygq0HNCltU8N4-3KOacXlrsB9oGAcI";

// Crear una función que genere instancias de Axios
const createApiService = (prefix: "admin" | "hotel") => {
  const instance = axios.create({
    baseURL: `${baseUrl}/${prefix}`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": AUTH_TOKEN,
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

// Exportar ambas instancias según el contexto
export const adminApi = createApiService("admin");
export const hotelApi = createApiService("hotel");
