import { hotelApi } from "../components/Apis/ApiService";
import { Image } from "../interfaces/imageInterface";

export const uploadMultipleImagesRoom = async (roomid: number, image: FormData): Promise<Image> => {  

    try {
      const response = await hotelApi.post(`upload_multiple_images/?room_id=${roomid}`, image, 
        {headers: {"Content-Type": "multipart/form-data"}});
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const uploadMultipleImagesAccommodation= async (accommodationId: number, image: FormData): Promise<Image> => {  

    try {
      const response = await hotelApi.post(`upload_multiple_images/?accommodation_id=${accommodationId}`, image, 
        {headers: {"Content-Type": "multipart/form-data"}});
      return response.data;
    } catch (error) {
      throw error;
    }
  };