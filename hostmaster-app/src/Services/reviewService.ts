import {getApiService} from "../components/Apis/ApiService";
import { Review } from "../interfaces/reviewInterface";

const hotelApi = getApiService("hotel");

export const getReviewByAccommodation = async (accommodation_id?:number): Promise<Review[]> => {
    try {
      const response = await hotelApi.get(`/reviews/accommodation/${accommodation_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Crear un nuevo reseña
  export const createReview= async (review: Review): Promise<Review> => {
    try {
      const response = await hotelApi.post("/reviews", review);
      return response.data;
    } catch (error) {
      throw error;
    }
  };