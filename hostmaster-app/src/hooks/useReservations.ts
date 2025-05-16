import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../Services/reservationService";
import { Reservation } from "../interfaces/reservationInterface";
import { isAfter, parseISO, isBefore } from "date-fns";
import { useMemo } from "react";

export const useReservations = () => {
  const { data: reservations = [], ...rest } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: getReservations,
    staleTime: 1000 * 60 * 5,
  });

  const today = new Date();

  const upcoming = useMemo(
    () =>
      reservations.filter(
        (r) =>
          r.status !== 'cancelled' &&
          isAfter(parseISO(r.end_date), today)
      ),
    [reservations]
  );

  const completed = useMemo(
    () =>
      reservations.filter(
        (r) =>
          r.status !== 'cancelled' &&
          isBefore(parseISO(r.end_date), today)
      ),
    [reservations]
  );

  const cancelled = useMemo(
    () => reservations.filter((r) => r.status === 'cancelled'),
    [reservations]
  );

  return {
    upcoming,
    completed,
    cancelled,
    ...rest,
  };
};