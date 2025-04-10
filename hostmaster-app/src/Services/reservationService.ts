import apiService from "../components/Apis/ApiService";
import { Reservation


 } from "../interfaces/reservationInterface";

 export const getReservations = async (): Promise<Reservation[]> => {
    try {
      const response = await apiService.get("/resevations");
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  