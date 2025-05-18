import { useQuery } from "@tanstack/react-query";
import { Reservation } from "../interfaces/reservationInterface";
import { getReservations } from "../Services/reservationService";
import { User } from "../interfaces/userInterface";

export const useReservationsByCustomer = (clients: User[]) => {
  const {
    data: reservations = [],
    isLoading,
    error,
  } = useQuery<Reservation[]>({
    queryKey: ["rooms"],
    queryFn: ({ queryKey }) => {
      const [] = queryKey;
      return getReservations();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const counts = clients.reduce((acc, client) => {
    const count =
      reservations.filter((r) => r.user_username === client.username).length ||
      0;
    acc[client.username] = count;
    return acc;
  }, {} as Record<string, number>);

  return { counts, isLoading, error };
};
