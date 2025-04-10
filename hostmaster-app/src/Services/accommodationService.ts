import apiService from "../components/Apis/ApiService";
import { Accommodation } from "../interfaces/accommodationInterface";


// Obtener todos los alojamientos
export const getAccommodations = async (): Promise<Accommodation[]> => {
  try {
    const response = await apiService.get("/accommodations");
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Crear un nuevo alojamiento
export const createAccommodation = async (accommodation: Accommodation): Promise<Accommodation> => {
    try {
      const response = await apiService.post("/accommodations", accommodation);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Actualizar un alojamiento existente
  export const updateAccommodation = async (id: number, accommodation: Accommodation): Promise<Accommodation> => {
    try {
      const response = await apiService.patch(`/accommodations/${id}?accommodation_id=${id}`, accommodation);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
// Eliminar un alojamiento
export const deleteAccommodation  = async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/accommodations/${id}`);
    } catch (error) {
      throw error;
    }
  };
  
