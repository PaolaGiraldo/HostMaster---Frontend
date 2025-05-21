import {getApiService} from "../components/Apis/ApiService";
import { Product } from "../interfaces/roomProductInterface";


export const hotelApi = getApiService("hotel");
// Obtener todos los servicios
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await hotelApi.get("/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRoomProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await hotelApi.post("/products", product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoomProduct = async (id: number, product: Product): Promise<Product> => {
  try {
    const response = await hotelApi.patch(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoomProduct = async (id: number): Promise<void> => {
    try {
      await hotelApi.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  };