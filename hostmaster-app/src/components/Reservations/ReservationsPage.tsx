import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList";
import { Reservation } from "../../interfaces/reservationInterface";
import { getReservations } from "../../Services/reservationService";

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservations();
        setReservations(response);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="container mt-4">
      <ReservationList reservations={reservations} />
    </div>
  );
};

export default ReservationsPage;
