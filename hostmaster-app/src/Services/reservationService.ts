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

  export const createReservations = async (reservation: Reservation): Promise<Reservation[]> => {
    try {
      console.log("enviar reserva")
      const response = await hotelApi.post("/reservations", reservation);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  