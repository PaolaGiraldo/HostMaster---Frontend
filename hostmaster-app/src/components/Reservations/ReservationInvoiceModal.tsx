import React from "react";
import { Button, Modal } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { ReservationInvoice } from "../../interfaces/resevationInvoceInterface";
import { reservationStatuses } from "../../constants/reservationStatusList";

interface ReservationDetailModalProps {
  show: boolean;
  onClose: () => void;
  sendInvoice: (reservationId: number) => void;
  invoice: ReservationInvoice | null;
}

const ReservationInvoiceModal: React.FC<ReservationDetailModalProps> = ({
  show,
  onClose,
  sendInvoice,
  invoice,
}) => {
  const { t } = useTranslation();

  const handleSendInvoice = () => {
    sendInvoice(invoice?.reservation_id!);
  };

  return (
    <>
      {/* Modal de Detalles de Reserva */}
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Cobro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {invoice && (
            <>
              <p>
                <strong>Cliente:</strong> {invoice.user.first_name}{" "}
                {invoice.user.last_name}
              </p>
              <p>
                <strong>Alojamiento:</strong> {invoice.accommodation.name}
              </p>
              <p>
                <strong>Habiación:</strong> {invoice.room.number}
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {invoice.reservation_details.start_date}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {invoice.reservation_details.end_date}
              </p>
              <p>
                <strong>Número de Huespedes:</strong>{" "}
                {invoice.reservation_details.guest_count}
              </p>
              <p>
                <strong>Número de Noches:</strong>{" "}
                {invoice.reservation_details.number_of_nights}
              </p>

              {invoice.cost_breakdown.extra_services?.length > 0 ? (
                <p>
                  <strong>Servicios:</strong>{" "}
                  {invoice.cost_breakdown.extra_services
                    .map((service) => service.service_name)
                    .join(", ")}
                </p>
              ) : (
                <p>
                  <strong>Servicios:</strong> No hay servicios adicionales.
                </p>
              )}
              <p>
                <strong>Estado:</strong>{" "}
                {reservationStatuses
                  .filter(
                    (status) =>
                      status.value === invoice.reservation_details.status
                  )
                  .map((status) => t(status.labelKey))}{" "}
              </p>
              <p>
                <strong>Total a pagar:</strong>{" "}
                {invoice.cost_breakdown.total_cost}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSendInvoice}>
            {t("send")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReservationInvoiceModal;
