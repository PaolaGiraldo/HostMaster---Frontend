import React from "react";
import { Card, Button } from "react-bootstrap";
import { Reservation } from "../../interfaces/reservationInterface";

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails: (reservation: Reservation) => void;
  onDelete: (id?: number) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onViewDetails,
  onDelete,
}) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{reservation.user_username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {reservation.start_date} - {reservation.end_date}
        </Card.Subtitle>
        <Card.Text>
          <strong>Estado:</strong> {reservation.status} <br />
        </Card.Text>
        <Button variant="primary" onClick={() => onViewDetails(reservation)}>
          Ver Detalles
        </Button>
        <Button
          variant="danger"
          className="ms-2"
          onClick={() => onDelete(reservation.id)}
        >
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ReservationCard;
