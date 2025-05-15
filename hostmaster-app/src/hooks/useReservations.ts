import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../Services/reservationService";
import { Reservation } from "../interfaces/reservationInterface";

export const useReservations = () => {
  return useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: ({ queryKey }) => {
      const [] = queryKey;
      return getReservations();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
