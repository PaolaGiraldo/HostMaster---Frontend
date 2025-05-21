import {authApi} from "../components/Apis/ApiService";
import { User } from "../interfaces/userInterface";


export const getMeUser = async (token: string): Promise<User> => {
  try {
    const response = await authApi.get("/users/me",{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
  } catch (error) {
    throw new Error("No se pudo obtener el perfil del usuario");
  }
};


export const authenticateUser = async (username: string, password: string)=> {

    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("scope", "");
    formData.append("client_id", "string");
    formData.append("client_secret", "string");
    
    try {
      const response = await authApi.post("/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" ,
            Accept: "application/json",
        },
        
      });

      return response.data;

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
  };