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
    try {
    const response = await adminApi.get(`/dashboard/top-revenue-days-by-weekday`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getRevenue = async ( {params} ) => {
    try {
    const response = await adminApi.get(`/dashboard/revenue`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getPerformance = async ( {params} ) => {
    try {
    const response = await adminApi.get(`/dashboard/performance`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getPendingMaintenances = async ( {params} ) => {
    try {
    const response = await adminApi.get(`/dashboard/maintenance`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getSummary = async ( {params} ) => {
    try {
    const response = await adminApi.get(`/dashboard/summary`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };



  