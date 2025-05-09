import adminApiService from "../components/Apis/AdminApiService";
import { User } from "../interfaces/userInterface";

export const getClients = async () => {
    try {
    const response = await adminApiService.get("/users?role=client");
    return response.data;
} catch (error) {
        throw error;
      }
  };

export const createUser = async (service: User): Promise<User> => {
    try {
      const response = await adminApiService.post("/users/by-role?role=client", service);
      return response.data;
    } catch (error) {
      throw error;
    }
  };