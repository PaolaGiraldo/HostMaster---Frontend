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
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("invoice.detailsTitle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {invoice && (
          <>
            <p>
              <strong>{t("invoice.client")}:</strong> {invoice.user.first_name}{" "}
              {invoice.user.last_name}
            </p>
            <p>
              <strong>{t("invoice.accommodation")}:</strong>{" "}
              {invoice.accommodation.name}
            </p>
            <p>
              <strong>{t("invoice.room")}:</strong> {invoice.room.number}
            </p>
            <p>
              <strong>{t("invoice.checkin")}:</strong>{" "}
              {invoice.reservation_details.start_date}
            </p>
            <p>
              <strong>{t("invoice.checkout")}:</strong>{" "}
              {invoice.reservation_details.end_date}
            </p>
            <p>
              <strong>{t("invoice.guestCount")}:</strong>{" "}
              {invoice.reservation_details.guest_count}
            </p>
            <p>
              <strong>{t("invoice.nightCount")}:</strong>{" "}
              {invoice.reservation_details.number_of_nights}
            </p>

            <p>
              <strong>{t("invoice.services")}:</strong>{" "}
              {invoice.cost_breakdown.extra_services?.length > 0
                ? invoice.cost_breakdown.extra_services
                    .map((service) => service.service_name)
                    .join(", ")
                : t("invoice.noExtraServices")}
            </p>

            <p>
              <strong>{t("invoice.status")}:</strong>{" "}
              {reservationStatuses.find(
                (status) => status.value === invoice.reservation_details.status
              )?.labelKey &&
                t(
                  reservationStatuses.find(
                    (status) =>
                      status.value === invoice.reservation_details.status
                  )!.labelKey
                )}
            </p>

            <p>
              <strong>{t("invoice.total")}:</strong>{" "}
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "COP",
              }).format(invoice.cost_breakdown.total_cost)}
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSendInvoice}>
          {t("invoice.send")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationInvoiceModal;
