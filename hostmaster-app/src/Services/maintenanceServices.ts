import {hotelApi} from "../components/Apis/ApiService";
import { Maintenance } from "../interfaces/maintenanceInterface";

 export const getMaintenances = async (): Promise<Maintenance[]> => {
    try {
      const response = await hotelApi.get("/maintenances");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const createMaintenance = async (maintenance: Maintenance): Promise<Maintenance> => {
    try {
      const response = await hotelApi.post("/maintenances", maintenance);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateMaintenance = async (id: number,maintenance: Maintenance): Promise<Maintenance> => {
    try {
      const response = await hotelApi.put(`/maintenances/${id}`, maintenance);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

