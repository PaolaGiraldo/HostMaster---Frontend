import React from "react";
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
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("reservations.detailsTitle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reservation && (
          <>
            <p>
              <strong>{t("reservations.client")}:</strong> {client?.full_name}
            </p>
            <p>
              <strong>{t("reservations.accommodation")}:</strong>{" "}
              {accommmodation?.name}
            </p>
            <p>
              <strong>{t("reservations.room")}:</strong> {room?.number}
            </p>
            <p>
              <strong>{t("reservations.checkin")}:</strong>{" "}
              {reservation.start_date}
            </p>
            <p>
              <strong>{t("reservations.checkout")}:</strong>{" "}
              {reservation.end_date}
            </p>

            <p>
              <strong>{t("reservations.services")}:</strong>{" "}
              {reservation.extra_services?.length > 0
                ? reservation.extra_services.map((s) => s.name).join(", ")
                : t("reservations.noExtraServices")}
            </p>

            <p>
              <strong>{t("reservations.status")}:</strong> {reservation.status}
            </p>
            <p>
              <strong>{t("reservations.observations")}:</strong>{" "}
              {reservation.observations}
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
  );
};

export default ReservationDetailModal;
