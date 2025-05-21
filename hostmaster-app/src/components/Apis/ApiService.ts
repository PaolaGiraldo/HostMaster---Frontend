// apiService.ts
import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const getApiService = (prefix: "admin" | "hotel" | "auth") => {
  const token = localStorage.getItem("token"); // Se lee en el momento de uso

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
