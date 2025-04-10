import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList";
import apiService from "../Apis/ApiService";
import { Reservation } from "../../interfaces/reservationInterface";

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await apiService.get("/reservations");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Reservas</h2>
      <ReservationList reservations={reservations} />
    </div>
  );
};

export default ReservationsPage;
