import { useQuery } from "@tanstack/react-query";
import { ReservationInvoice } from "../interfaces/resevationInvoceInterface";
import { getReservationInvoice } from "../services/reservationService";


export const useReservationInvoice = (reservationId: number) => {
    return useQuery<ReservationInvoice>({
      queryKey: ['invoice', reservationId],
      queryFn: ({ queryKey }) => {
        const [, id] = queryKey;
        return getReservationInvoice(id as number);
      },
      staleTime: 1000 * 60 * 5, // 5 min
    });
  };
  