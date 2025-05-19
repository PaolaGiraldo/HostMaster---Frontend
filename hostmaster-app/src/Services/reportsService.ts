import { adminApi } from "../components/Apis/ApiService";

export const getOccupancy = async ( {params} ) => {
    try {
    const response = await adminApi.get(`/dashboard/occupancy`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };
