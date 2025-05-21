import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button } from "react-bootstrap";
import { Reservation } from "../../interfaces/reservationInterface";
import { useClients } from "../../hooks/useCustomers";
import { useRooms } from "../../hooks/useRooms";
import { useAccommodations } from "../../hooks/useAccommodations";
import ReservationDetailModal from "./ReservationDetailModal";
import {
  reservationStatuses,
  STATUS_COLORS,
} from "../../constants/reservationStatusList";
import { FaEdit } from "react-icons/fa";
import { isToday, parseISO } from "date-fns";
import {
  getReservationInvoice,
  sendReservationInvoice,
  updateReservation,
} from "../../services/reservationService";
import { useQueryClient } from "@tanstack/react-query";
import ReservationInvoiceModal from "./ReservationInvoiceModal";
import { ReservationInvoice } from "../../interfaces/resevationInvoceInterface";
import { toast } from "react-toastify";

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onEdit,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [invoice, setInvoice] = useState<ReservationInvoice | null>(null);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowInvoiceModal(false);
  };

  const isTodayStartDate = isToday(parseISO(reservation.start_date));

  const handleCheckInOut = () => {
    if (reservation.status === "confirmed") {
      updateReservationStatus(reservation, "checkedIn");
    } else if (reservation.status === "checkedIn") {
      updateReservationStatus(reservation, "checkedOut");
      generateInvoice(reservation.id!);
    }
  };

  const updateReservationStatus = async (
    reservation: Reservation,
    newStatus: string
  ) => {
    try {
      reservation.status = newStatus;
      await updateReservation(reservation.id!, reservation);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva guardad correctamente");
    } catch (error: any) {
      console.error("Error updating reservation status", error);
      const msg = error?.response?.data?.detail || "Error al guardar reserva";
      toast.error(msg);
    }
  };

  const generateInvoice = async (reservationId: number) => {
    try {
      const invoice = await getReservationInvoice(reservationId);
      setInvoice(invoice);
      setShowInvoiceModal(true);
      toast.success("Cuenta de cobro generada correctamente");
    } catch (error: any) {
      console.error("Error updating reservation status", error);
      const msg =
        error?.response?.data?.detail || "Error al generar cuenta de cobro";
      toast.error(msg);
    }
  };

  const sendInvoice = async (reservationId: number) => {
    try {
      await sendReservationInvoice(reservationId);
      setShowInvoiceModal(false);
      toast.success("Cuenta de cobro enviada correctamente");
    } catch (error: any) {
      console.error("Error updating reservation status", error);
      const msg =
        error?.response?.data?.detail || "Error al enviar cuenta de cobro";
      toast.error(msg);
    }
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
  };

  return (
    <>
      <Card
        className="mb-3 shadow-sm"
        style={{
          backgroundColor: STATUS_COLORS[reservation.status] || "#3a3a3a",
          color: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <Card.Body>
          <Card.Title>
            <div className="d-flex justify-content-between align-items-center mb-2">
              {accommodation?.name} {room?.number}
              {reservation.status !== "cancelled" &&
                reservation.status !== "checkedOut" && (
                  <Button
                    variant="ligth"
                    size="lg"
                    className="me-2"
                    onClick={() => onEdit(reservation)}
                  >
                    <FaEdit />
                  </Button>
                )}
            </div>
          </Card.Title>

          <Card.Subtitle className="mb-2 text-muted">
            {reservation.start_date} - {reservation.end_date}
            <br />
            {client?.full_name}
          </Card.Subtitle>
          <Card.Text>
            <strong>{t("reservations.status")}:</strong>{" "}
            {reservationStatuses
              .filter((status) => status.value === reservation.status)
              .map((status) => t(status.labelKey))}{" "}
            <br />
            <strong>{t("reservations.email")}:</strong> {client?.email}
            <br />
          </Card.Text>

          <Button variant="primary" onClick={() => setShowModal(true)}>
            {t("reservations.details")}
          </Button>

          {reservation.status !== "cancelled" &&
            reservation.status !== "checkedOut" && (
              <Button
                variant="danger"
                className="ms-2"
                onClick={() => onCancel(reservation)}
              >
                {t("reservations.cancel")}
              </Button>
            )}

          {reservation.status !== "cancelled" &&
            reservation.status !== "checkedOut" && (
              <Button
                className="ms-2"
                variant={
                  reservation.status === "checkedIn" ? "warning" : "success"
                }
                onClick={handleCheckInOut}
                disabled={
                  !isTodayStartDate ||
                  !["confirmed", "checkedIn"].includes(reservation.status)
                }
              >
                {reservation.status === "checkedIn"
                  ? t("Check-Out")
                  : t("Check-In")}
              </Button>
            )}
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

      <ReservationInvoiceModal
        show={showInvoiceModal}
        onClose={handleCloseModal}
        sendInvoice={sendInvoice}
        invoice={invoice}
      ></ReservationInvoiceModal>
    </>
  );
};

export default React.memo(ReservationCard);
