import axios from "axios";

// URL base del backend
const BASE_API_URL = "http://3.85.88.149:8000"; // o usar variable de entorno

// Token (puedes cargarlo desde localStorage o variables de entorno si es dinámico)
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc0NzMyNjg4NX0.cHkjmR84WUmlKA-BHo4UQNRfc9rFYVDiLEya-YGG1aM";

// Crear una función que genere instancias de Axios
const createApiService = (prefix: "admin" | "hotel") => {
  const instance = axios.create({
    baseURL: `${BASE_API_URL}/${prefix}`,
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
