import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { Reservation } from "../../interfaces/reservationInterface";
import ReservationForm from "./RerservationForm";
import {
  createReservation,
  updateReservation,
} from "../../services/reservationService";
import { useReservationsOrdered } from "../../hooks/useReservationsOrdered";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { reservationStatuses } from "../../constants/reservationStatusList";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useRooms } from "../../hooks/useRooms";
import { useClients } from "../../hooks/useCustomers";
import { linkMultipleServices } from "../../services/reservationExtraServicesService";
import ReservationSection from "./ReservationSection";

interface ReservationListProps {}

const ReservationList: React.FC<ReservationListProps> = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: accommodations } = useAccommodations();
  const { upcoming, completed, cancelled, isLoading, error } =
    useReservationsOrdered();

  const { data: rooms = [] } = useRooms();
  const { data: clients } = useClients();
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterAccommodation, setFilterAccommodation] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [customerName, setCustomerName] = useState<string | null>(null);

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleClearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterAccommodation("");
    setFilterRoom("");
    setFilterCustomer("");
    setFilterStatus("");
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowReservationForm(true);
  };

  const handleSaveReservation = async (reservation: Reservation) => {
    try {
      const savedReservation = reservation.id
        ? await updateReservation(reservation.id!, reservation)
        : await createReservation(reservation);

      if (reservation.extra_services.length > 0) {
        await linkMultipleServices(
          savedReservation.id!,
          reservation.extra_services
        );
      }
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setShowReservationForm(false);
      setEditingReservation(null);

      toast.success("Reserva guardada correctamente");
      // Recargar la lista de reservas después de la actualización/creación
    } catch (error: any) {
      console.error("Error en handleSaveRoom:", error);
      const msg = error?.response?.data?.detail || "Error al guardar reserva";
      toast.error(msg);
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    if (!canCancelReservation(reservation.start_date)) {
      alert(t("reservations.cancel_error_15_days"));
      return;
    }
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const filteredReservations = (reservations: Reservation[]) =>
    reservations?.filter((reservation) => {
      const room = rooms.find((r) => r.id === reservation.room_id);
      return (
        (!filterDateFrom || reservation.start_date >= filterDateFrom) &&
        (!filterDateTo || reservation.end_date <= filterDateTo) &&
        (!filterAccommodation ||
          reservation.accommodation_id === Number(filterAccommodation)) &&
        (!filterRoom || (room && String(room.number).startsWith(filterRoom))) &&
        (!filterCustomer || reservation.user_username === customerName) &&
        (!filterStatus ||
          reservation.status.toLowerCase() === filterStatus.toLowerCase())
      );
    });

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterCustomer(value);

    const foundCustomer = clients?.find((client: { full_name: string }) =>
      client.full_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(filterCustomer.toLowerCase())
    );
    setCustomerName(foundCustomer?.username ?? null);
  };

  const canCancelReservation = (startDateStr: string): boolean => {
    const today = new Date();
    const startDate = new Date(startDateStr);
    const diffInMs = startDate.getTime() - today.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays >= 15;
  };

  const cancelReservation = async (id: number, reservation: Reservation) => {
    try {
      reservation.status = "cancelled";
      await updateReservation(id, reservation);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva cancelada correctamente");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Error al cancelar reserva";
      toast.error(msg);
    }
  };

  const [showReservationForm, setShowReservationForm] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);

  const handleCloseReservationForm = () => {
    setShowReservationForm(false);
    setEditingReservation(null); // ✅ Limpiar la reserva en edición
  };

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center my-4">{t("reservations.title")}</h2>
        <Row className="mb-3">
          <Col>
            <Button
              variant="primary"
              className="mb-3"
              onClick={() => setShowReservationForm(true)}
            >
              {t("reservations.new")}
            </Button>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="secondary" onClick={handleClearFilters}>
              {t("clearFilters")}
            </Button>
          </Col>
        </Row>

        <Form className="mb-3">
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("reservations.from")}
                </Form.Label>
                <Form.Control
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("reservations.to")}
                </Form.Label>
                <Form.Control
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("accommodation")}
                </Form.Label>
                <Form.Select
                  value={filterAccommodation}
                  onChange={(e) => setFilterAccommodation(e.target.value)}
                >
                  <option value="">{t("all1")}</option>
                  {accommodations?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("room")}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("rooms.roomNumber")}
                  value={filterRoom}
                  onChange={(e) => setFilterRoom(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("customer")}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("clients.name")}
                  value={filterCustomer}
                  onChange={handleClientChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("reservations.status")}
                </Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">{t("all1")}</option>
                  {reservationStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {t(status.labelKey)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" />
            <div>{t("loading")}</div>
          </div>
        ) : error ? (
          <div className="text-center text-danger">
            {t("accommodations.loadError")}
          </div>
        ) : (
          <div className="container py-4">
            {/* Próximas reservas */}

            <ReservationSection
              title={t("reservations.upcoming")}
              icon="📅"
              reservations={filteredReservations(upcoming)}
              emptyMessage={t("reservations.noUpcoming")}
              onCancel={handleCancelReservation}
              onEdit={handleEditReservation}
            />

            <ReservationSection
              title={t("reservations.completed")}
              icon="✅"
              reservations={filteredReservations(completed)}
              emptyMessage={t("reservations.noCompleted")}
              onCancel={handleCancelReservation}
              onEdit={handleEditReservation}
            />

            <ReservationSection
              title={t("reservations.cancelled")}
              icon="❌"
              reservations={filteredReservations(cancelled)}
              emptyMessage={t("reservations.noCancelled")}
              onCancel={handleCancelReservation}
              onEdit={handleEditReservation}
            />
          </div>
        )}
        <ReservationForm
          show={showReservationForm}
          onHide={handleCloseReservationForm}
          onSave={handleSaveReservation}
          editingReservation={editingReservation}
        ></ReservationForm>
      </div>

      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("reservations.confirmCancel")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("reservations.confirmCancel1")}
          <br />
          <strong>{t("reservations.start_date")}:</strong>{" "}
          {selectedReservation?.start_date}
          <br />
          <strong>{t("reservations.customer")}:</strong>{" "}
          {
            clients?.find(
              (c) => c.username === selectedReservation?.user_username
            )?.full_name
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            {t("close")}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (selectedReservation) {
                cancelReservation(selectedReservation.id!, selectedReservation); // Llama tu función de cancelación
                setShowCancelModal(false);
              }
            }}
          >
            {t("reservations.confirmCancel")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ReservationList;
