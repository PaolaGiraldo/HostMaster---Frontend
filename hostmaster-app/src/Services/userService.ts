import adminApiService from "../components/Apis/AdminApiService";
import { User } from "../interfaces/userInterface";

export const getClients = async () => {
    try {
    const response = await adminApiService.get("/users/by-role?role=client");
    return response.data;
} catch (error) {
        throw error;
      }
  };

export const createClient = async (user: User): Promise<User> => {
    try {
      const response = await adminApiService.post("/users", user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateClient = async (username: string, user: User): Promise<User> => {
    try {
      const response = await adminApiService.patch(`/extra-services/${username}`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const deleteClient = async (username: string): Promise<void> => {
    try {
      await adminApiService.delete(`/users/${username}`);
    } catch (error) {
      throw error;
    }
  };
  

