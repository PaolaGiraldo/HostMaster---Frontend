import apiService from "../components/Apis/ApiService";

const locationService = {
  getCountries: async () => {
    try {
      const response = await apiService.get("/countries");
      return response.data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  },

  getCities: async () => {
    try {
      const response = await apiService.get("/cities");
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  },

  getStates: async () => {
    try {
      const response = await apiService.get("/states");
      return response.data;
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  },

  getCityById: async (Id: number) => {
    try {
      const response = await apiService.get(`/cities/${Id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  },

};

export default locationService;
