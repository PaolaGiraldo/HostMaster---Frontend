import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../Services/roomService";
import { Room } from "../interfaces/roomInterface";

export const useRooms = () => {
  return useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: ({ queryKey }) => {
      const [] = queryKey;
      return getRooms();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
