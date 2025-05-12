import {hotelApi} from "../components/Apis/ApiService";
import { Reservation} from "../interfaces/reservationInterface";

 export const getReservations = async (): Promise<Reservation[]> => {
    try {
      const response = await hotelApi.get("/reservations");
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  