import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReservationCalendar from "./ReservationCalendar";
import { Reservation } from "../../interfaces/reservationInterface";
import { getReservations } from "../../Services/reservationService";
import { getRooms } from "../../Services/roomService";
import { Room } from "../../interfaces/roomInterface";

const ReservationCalendarList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchReservations();
    fetchRooms();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getReservations();
      setReservations(response);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const { t } = useTranslation();

  return (
    <Container>
      <ReservationCalendar reservations={reservations} rooms={rooms} />
    </Container>
  );
};

export default ReservationCalendarList;
