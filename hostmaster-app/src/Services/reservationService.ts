import {getApiService} from "../components/Apis/ApiService";
import { Reservation} from "../interfaces/reservationInterface";
import { ReservationInvoice } from "../interfaces/resevationInvoceInterface";


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


  export const getReservationInvoice = async (id: number): Promise<ReservationInvoice> => {
     try {
       const response = await hotelApi.get(`/reservations/${id}/invoice`);
       return response.data;
     } catch (error) {
       throw error;
     }
   };

   export const sendReservationInvoice = async (id: number) => {
    try {
      const response = await hotelApi.post(`/reservations/${id}/send-invoice`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 

  