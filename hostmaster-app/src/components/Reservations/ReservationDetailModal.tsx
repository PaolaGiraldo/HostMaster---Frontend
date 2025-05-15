import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { Reservation } from "../../interfaces/reservationInterface";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { Room } from "../../interfaces/roomInterface";
import { User } from "../../interfaces/userInterface";

interface ReservationDetailModalProps {
  show: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  client: User | undefined;
  accommmodation: Accommodation | undefined;
  room: Room | undefined;
}

const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  show,
  onClose,
  reservation,
  client,
  accommmodation,
  room,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Modal de Detalles de Reserva */}
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservation && (
            <>
              <p>
                <strong>Cliente:</strong> {client?.full_name}
              </p>
              <p>
                <strong>Alojamiento:</strong> {accommmodation?.name}
              </p>
              <p>
                <strong>Habiación:</strong> {room?.number}
              </p>
              <p>
                <strong>Check-in:</strong> {reservation.start_date}
              </p>
              <p>
                <strong>Check-out:</strong> {reservation.end_date}
              </p>

              {reservation.extra_services?.length > 0 ? (
                <p>
                  <strong>Servicios:</strong>{" "}
                  {reservation.extra_services
                    .map((service) => service.name)
                    .join(", ")}
                </p>
              ) : (
                <p>
                  <strong>Servicios:</strong> No hay servicios adicionales.
                </p>
              )}
              <p>
                <strong>Estado:</strong> {reservation.status}
              </p>
              <p>
                <strong>Observaciones:</strong> {reservation.observations}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReservationDetailModal;
