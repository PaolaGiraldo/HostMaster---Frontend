import { getApiService } from "../components/Apis/ApiService";
import { Service } from "../interfaces/serviceInterface";

const hotelApi = getApiService("hotel");


interface LinkServicePayload {
  reservation_id: number;
  extra_service_id: number;
}

export const linkService = async (
  reservationId: number,
  service: Service
): Promise<any> => {
  try {
    const payload: LinkServicePayload = {
      reservation_id: reservationId,
      extra_service_id: service.id!,
    };

    const response = await hotelApi.post("/reservation-extra-services", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error al vincular servicio:", error);
    throw error;
  }
};

export const linkMultipleServices = async (
    reservationId: number,
    services: Service[]
  ): Promise<void> => {
    try {
      const requests = services.map((service) =>
        linkService(reservationId, service)
      );
      await Promise.all(requests);
    } catch (error) {
      console.error("Error al vincular servicios adicionales:", error);
      throw error;
    }
  };
  
  export const unlinkService = async (
    reservationId: number,
    serviceId: number
  ): Promise<any> => {
    try {
  
      const response = await hotelApi.delete(`/reservation-extra-services/${reservationId}/${serviceId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error al vincular servicio:", error);
      throw error;
    }
  };

