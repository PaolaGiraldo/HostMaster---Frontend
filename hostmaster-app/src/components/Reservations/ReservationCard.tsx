import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button } from "react-bootstrap";
import { Reservation } from "../../interfaces/reservationInterface";
import { useClients } from "../../hooks/useUsers";
import { useRooms } from "../../hooks/useRooms";
import { useAccommodations } from "../../hooks/useAccommodations";
import ReservationDetailModal from "./ReservationDetailModal";
import { STATUS_COLORS } from "../../constants/reservationStatusList";

interface ReservationCardProps {
  reservation: Reservation;
  onDelete: (id?: number) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { data: clients } = useClients();
  const client = clients?.find(
    (client) => client.username === reservation.user_username
  );

  const { data: rooms } = useRooms();
  const room = rooms?.find((room) => room.id === reservation.room_id);

  const { data: accommodations } = useAccommodations();
  const accommodation = accommodations?.find(
    (accommodation) => accommodation.id === reservation.accommodation_id
  );

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card
        className="mb-3 shadow-sm"
        style={{
          backgroundColor: STATUS_COLORS[reservation.status],
          color: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <Card.Body>
          <Card.Title>
            {accommodation?.name} {room?.number}
          </Card.Title>

          <Card.Subtitle className="mb-2 text-muted">
            {reservation.start_date} - {reservation.end_date}
            <br />
            {client?.full_name}
          </Card.Subtitle>
          <Card.Text>
            <strong>Estado:</strong> {reservation.status} <br />
            <strong>Email:</strong> {client?.email}
            <br />
          </Card.Text>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Ver Detalles
          </Button>
          <Button
            variant="danger"
            className="ms-2"
            onClick={() => onDelete(reservation.id)}
          >
            Finalizar
          </Button>
        </Card.Body>
      </Card>

      <ReservationDetailModal
        show={showModal}
        onClose={handleCloseModal}
        reservation={reservation}
        client={client}
        accommmodation={accommodation}
        room={room}
      ></ReservationDetailModal>
    </>
  );
};

export default ReservationCard;
