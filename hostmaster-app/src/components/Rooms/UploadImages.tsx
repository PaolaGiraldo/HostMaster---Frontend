import { uploadMultipleImagesRoom } from "../../Services/imagesService";

export const uploadRoomImages = async (
  accommodationId: number,
  images: File[]
) => {
  const formData = new FormData();
  images.forEach((img) => {
    formData.append("files", img);
  });

  try {
    await uploadMultipleImagesRoom(accommodationId, formData);
  } catch (error) {
    throw error;
  }
};
