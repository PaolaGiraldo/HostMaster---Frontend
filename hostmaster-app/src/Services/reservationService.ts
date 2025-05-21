import {getApiService} from "../components/Apis/ApiService";
import { Reservation} from "../interfaces/reservationInterface";


const hotelApi = getApiService("hotel");

 export const getReservations = async (): Promise<Reservation[]> => {
    try {
      const response = await hotelApi.get("/reservations");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const createReservation = async (reservation: Reservation): Promise<Reservation> => {
    try {
      const response = await hotelApi.post("/reservations", reservation);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateReservation = async (id: number,reservation: Reservation): Promise<Reservation> => {
    try {
      const response = await hotelApi.patch(`/reservations/${id}`, reservation);
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  