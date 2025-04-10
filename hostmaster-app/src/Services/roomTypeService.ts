import apiService from "../components/Apis/ApiService";
import { RoomType } from "../interfaces/roomTypeInterface";


export const getRoomTypes = async (): Promise<RoomType[]> => {
    try {
      const response = await apiService.get("/room-types");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getRoomTypeById = async (id?:number): Promise<RoomType> => {
    try {
      const response = await apiService.get(`/room-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const createRoomType = async (roomType: RoomType): Promise<RoomType> => {
    try {
      const response = await apiService.post("/room-types", roomType);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateRoomType = async (id: number, roomType: RoomType): Promise<RoomType> => {
    try {
      const response = await apiService.put(`/room-types/${id}`, roomType);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
export const deleteRoomType = async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/room-types/${id}`);
    } catch (error) {
      throw error;
    }
  };
