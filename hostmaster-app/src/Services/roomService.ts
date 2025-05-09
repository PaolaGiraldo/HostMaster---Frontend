import apiService from "../components/Apis/ApiService";
import { Room } from "../interfaces/roomInterface";


// Obtener habitación por alojamiento
export const getRoomsByAccommodation = async (accommodation_id?:number): Promise<Room[]> => {
  try {
    const response = await apiService.get(`/accommodations/${accommodation_id}/rooms`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getRooms = async (): Promise<Room[]> => {
    try {
      const response = await apiService.get("/rooms");
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  


// Crear un nuevo alojamiento
export const createRoom = async (room: Room): Promise<Room> => {
    try {
      const response = await apiService.post("/rooms", room);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Actualizar un alojamiento existente
  export const updateRoom = async (id: number, room: Room): Promise<Room> => {
    try {
      const response = await apiService.patch(`/rooms/${id}?room_id=${id}`, room);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
// Eliminar un alojamiento
export const deleteRoom = async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/rooms/${id}`);
    } catch (error) {
      throw error;
    }
  };

  
  export const getRoomsWithReservations = async ({ params }): Promise<Room[]> => {
    try {
      const response = await apiService.get("/booked_rooms/", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
