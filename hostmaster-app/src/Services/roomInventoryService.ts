import apiService from "../components/Apis/ApiService";
import { RoomInventory } from "../interfaces/roomInventorynterface";


export const getRoomInventory = async (id?:number): Promise<RoomInventory[]> => {
    try {
      const response = await apiService.get(`/room-inventory/room/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getRoomInventoryById = async (id?:number): Promise<RoomInventory> => {
    try {
      const response = await apiService.get(`/room-inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const createRoomInventory = async (roomInventory: RoomInventory): Promise<RoomInventory> => {
    try {
      const response = await apiService.post("/room-inventory", roomInventory);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateRoomInventory = async (id: number, roomInventory: RoomInventory): Promise<RoomInventory> => {
    try {
      const response = await apiService.put(`/room-inventory/${id}`, roomInventory);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
export const deleteRoomInventory = async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/room-inventory/${id}`);
    } catch (error) {
      throw error;
    }
  };
