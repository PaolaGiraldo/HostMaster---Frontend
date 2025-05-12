import {adminApi} from "../components/Apis/ApiService";
import { User } from "../interfaces/userInterface";

export const getClients = async () => {
    try {
    const response = await adminApi.get("/users/by-role?role=client");
    return response.data;
} catch (error) {
        throw error;
      }
  };

export const createClient = async (user: User): Promise<User> => {
    try {
      const response = await adminApi.post("/users", user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateClient = async (username: string, user: User): Promise<User> => {
    try {
      const response = await adminApi.patch(`/extra-services/${username}`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const deleteClient = async (username: string): Promise<void> => {
    try {
      await adminApi.delete(`/users/${username}`);
    } catch (error) {
      throw error;
    }
  };
  

