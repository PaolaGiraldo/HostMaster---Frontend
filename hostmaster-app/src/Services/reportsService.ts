import { adminApi } from "../components/Apis/ApiService";

export const getOccupancy = async ( {params} ) => {
    try {
    const response = await adminApi.get(`/dashboard/occupancy`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };


  export const getRevenueByWeekDay = async ( {params} ) => {
    console.log("2REVENUE")
    try {
    const response = await adminApi.get(`/dashboard/top-revenue-days-by-weekday`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };
