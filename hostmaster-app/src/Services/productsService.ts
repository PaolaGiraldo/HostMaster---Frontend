import apiService from "../components/Apis/ApiService";
import { Product } from "../interfaces/roomProductInterface";

// Obtener todos los servicios
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiService.get("/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRoomProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await apiService.post("/products", product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoomProduct = async (id: number, product: Product): Promise<Product> => {
  try {
    const response = await apiService.patch(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoomProduct = async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  };