import { useQuery } from "@tanstack/react-query";
import { getRoomsWithReservations } from "../services/roomService";
import { format } from "date-fns";

export const useBookedRooms = (
  accommodationId: number,
  startDate: Date,
  endDate: Date
) => {
  const formattedStart = format(startDate, "yyyy-MM-dd");
  const formattedEnd = format(endDate, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["bookedRooms", formattedStart, formattedEnd, accommodationId],
    queryFn: async () => {
      const params: queryParams = {
        start_date: formattedStart,
        end_date: formattedEnd,
        accommodation_id: accommodationId,
      };

      const rooms = await getRoomsWithReservations({ params });
      return rooms;
    },
    staleTime: 1000 * 60 * 5,
  });
};
