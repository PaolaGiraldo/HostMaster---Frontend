import {hotelApi} from "../components/Apis/ApiService";
import { Service } from "../interfaces/serviceInterface"; // Importamos la interfaz

// Obtener todos los servicios
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await hotelApi.get("/extra-services");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo servicio
export const createService = async (service: Service): Promise<Service> => {
  try {
    const response = await hotelApi.post("/extra-services", service);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar un servicio existente
export const updateService = async (id: number, service: Service): Promise<Service> => {
  try {
    const response = await hotelApi.patch(`/extra-services/${id}`, service);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un servicio
export const deleteService = async (id: number): Promise<void> => {
  try {
    await hotelApi.delete(`/extra-services/${id}`);
  } catch (error) {
    throw error;
  }
};
