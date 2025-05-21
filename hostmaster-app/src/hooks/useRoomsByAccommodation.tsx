import { useQuery } from "@tanstack/react-query";
import { getRoomsByAccommodation } from "../services/roomService";
import { Room } from "../interfaces/roomInterface";

const fetchRoomsByAccommodation = async (accommodationId: number) => {
  const response = await getRoomsByAccommodation(accommodationId);
  return response;
};

export const useRoomsByAccommodation = (accommodationId: number) => {
  return useQuery<Room[]>({
    queryKey: ["rooms", accommodationId],
    queryFn: ({ queryKey }) => {
      const [] = queryKey;
      return fetchRoomsByAccommodation(accommodationId);
    },
    enabled: !!accommodationId, // Solo hace la consulta si el ID es válido
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
