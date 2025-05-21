import { uploadMultipleImagesAccommodation } from "../../services/imagesService";

export const uploadAccommodationImages = async (
  roomId: number,
  images: File[]
) => {
  const formData = new FormData();
  images.forEach((img) => {
    formData.append("files", img);
  });

  try {
    await uploadMultipleImagesAccommodation(roomId, formData);
  } catch (error) {
    throw error;
  }
};
