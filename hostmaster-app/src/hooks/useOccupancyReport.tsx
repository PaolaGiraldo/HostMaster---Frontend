// hooks/useOccupancyReport.ts
import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../Services/reservationService";
import { Reservation } from "../interfaces/reservationInterface";
import { addDays, isBefore, isEqual } from "date-fns";
const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const useOccupancyReport = (
  startDate: Date,
  endDate: Date,
  accommodationId: number
) => {
  return useQuery({
    queryKey: [
      "occupancy",
      formatDate(startDate),
      formatDate(endDate),
      accommodationId,
    ],
    queryFn: async () => {
      const reservations = await getReservations();

      // Filtrar por alojamiento si se especifica uno
      const filteredReservations = accommodationId
        ? reservations.filter(
            (res: Reservation) => res.accommodation_id === accommodationId
          )
        : reservations;

      const occupancyByDay: Record<string, number> = {};
      const days: string[] = [];

      const current = new Date(addDays(startDate, +1));
      while (
        isBefore(current, addDays(endDate, +1)) ||
        isEqual(current, addDays(endDate, +1))
      ) {
        const key = formatDate(current);
        occupancyByDay[key] = 0;
        days.push(key);
        current.setDate(current.getDate() + 1);
      }

      filteredReservations.forEach((res: Reservation) => {
        const checkIn = new Date(res.start_date);
        const checkOut = new Date(res.end_date);

        days.forEach((day) => {
          const d = new Date(day);
          if (d >= checkIn && d < checkOut) {
            occupancyByDay[day]++;
          }
        });
      });

      return {
        labels: days.map((d) =>
          new Date(d).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
          })
        ),
        data: days.map((d) => occupancyByDay[d]),
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};
