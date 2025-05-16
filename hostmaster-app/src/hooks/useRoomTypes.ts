import { useQuery } from "@tanstack/react-query";
import { getRoomTypes } from "../Services/roomTypeService";
import { RoomType } from "../interfaces/roomTypeInterface";

export const useRoomTypes = () => {
  return useQuery<RoomType[]>({
    queryKey: ['roomTypes'],
    queryFn: ({ queryKey }) => {
      const [] = queryKey;
      return getRoomTypes();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
