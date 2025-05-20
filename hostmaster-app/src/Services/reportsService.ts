import { adminApi } from "../components/Apis/ApiService";
import { OccupancyResponse } from "../interfaces/Reports/occupancyrResponseInterface";


  
export const getOccupancy = async ({
  params,
  }: {
  params: queryParams;
  }): Promise<OccupancyResponse> => {
     try {
      const response = await adminApi.get(`/dashboard/occupancy`,{params});
      return response.data;
  } catch (error) {
          throw error;
        }
  };
  


  export const getRevenueByWeekDay = async ({
    params,
    }: {
    params: queryParams;
    }) => {
    try {
    const response = await adminApi.get(`/dashboard/top-revenue-days-by-weekday`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getRevenue = async({
    params,
    }: {
    params: queryParams;
    }) => {
    try {
    const response = await adminApi.get(`/dashboard/revenue`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getPerformance = async ({
    params,
    }: {
    params: queryParams;
    }) => {
    try {
    const response = await adminApi.get(`/dashboard/performance`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getPendingMaintenances = async ({
    params,
    }: {
    params: queryParams;
    }) => {
    try {
    const response = await adminApi.get(`/dashboard/maintenance`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getSummary = async ({
    params,
    }: {
    params: queryParams;
    }) => {
    try {
    const response = await adminApi.get(`/dashboard/summary`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };

  export const getDailyMetrics = async ({
    params,
    }: {
    params: queryParams;
    }) => {
    try {
    const response = await adminApi.get(`/dashboard/daily-metrics`,{params});
    return response.data;
} catch (error) {
        throw error;
      }
  };




  