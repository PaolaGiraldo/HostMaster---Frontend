import { useQuery } from "@tanstack/react-query";
import { getRoomsWithReservations } from "../Services/roomService";
import { format } from "date-fns";

export const useBookedRooms = (
  startDate: Date,
  endDate: Date,
  accommodationId?: number
) => {
  const formattedStart = format(startDate, "yyyy-MM-dd");
  const formattedEnd = format(endDate, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["bookedRooms", formattedStart, formattedEnd, accommodationId],
    queryFn: async () => {
      const params: any = {
        start_date: formattedStart,
        end_date: formattedEnd,
      };
      if (accommodationId) {
        params.accommodation_id = accommodationId;
      }

      const rooms = await getRoomsWithReservations({ params });
      return rooms;
    },
    staleTime: 1000 * 60 * 5,
  });
};
