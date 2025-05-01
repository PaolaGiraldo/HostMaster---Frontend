import { getReservations } from "../../Services/reservationService";
import { Reservation } from "../../interfaces/reservationInterface";

export const getReservationById = async (
  id: number
): Promise<Reservation | null> => {
  try {
    const reservations = await getReservations();
    const found = reservations.find((r) => r.id === id);
    return found ?? null;
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    throw error;
  }
};
