import {getApiService} from "../components/Apis/ApiService";
import { User } from "../interfaces/userInterface";

export const adminApi = getApiService("admin");

export const getClients = async () => {
    try {
    const response = await adminApi.get("/users/by-role?role=client");
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getUsers = async () => {
    try {
    const response = await adminApi.get("/users");
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getStaff = async () => {
    try {
    const response = await adminApi.get("/users");
    return response.data;
} catch (error) {
        throw error;
      }
  };


  export const createUser = async (user: User): Promise<User> => {
    if (!user.username || !user.email || !user.password || !user.full_name) {
      throw new Error("Faltan campos obligatorios para crear el usuario.");
    }
  
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("full_name", user.full_name);
    formData.append("role", user.role);
    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("document_number", user.document_number);
  
    if (user.phone_number) {
      formData.append("phone_number", user.phone_number);
    }
  
    try {
      const response = await adminApi.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Error desconocido";
      throw new Error(`Error al crear el usuario: ${message}`);
    }
  };
  

  export const updateUser = async (username: string, user: User): Promise<User> => {
    const formData = new FormData()
  
    formData.append("email", user.email);
    formData.append("password",user.password!);
    formData.append("full_name", user.full_name);
    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("role", user.role);
    formData.append("document_number", user.document_number);
    formData.append("phone_number", user.phone_number);
  //formData.append("accommodation_ids", JSON.stringify(user.accommodation_ids));
  
    try {
      const response = await adminApi.patch(`/users/${username}`, formData, {headers: {"Content-Type": "multipart/form-data"}});
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const deleteUser = async (username: string): Promise<void> => {
    try {
      await adminApi.delete(`/users/${username}`);
    } catch (error) {
      throw error;
    }
  };
  

