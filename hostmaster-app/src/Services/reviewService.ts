import apiService from "../components/Apis/ApiService";
import { Review } from "../interfaces/reviewInterface";

export const getReviewByAccommodation = async (accommodation_id?:number): Promise<Review[]> => {
    try {
      const response = await apiService.get(`/reviews/accommodation/${accommodation_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };