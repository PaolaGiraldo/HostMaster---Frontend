import axios from "axios";



const token = localStorage.getItem("token");


// URL base del backend
const baseUrl = import.meta.env.VITE_SERVER_URL; 

// Token (puedes cargarlo desde localStorage o variables de entorno si es dinámico)

// Crear una función que genere instancias de Axios
const createApiService = (prefix: "admin" | "hotel" | "auth") => {
  const instance = axios.create({
    baseURL: `${baseUrl}/${prefix}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
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
export const authApi = createApiService("auth");
