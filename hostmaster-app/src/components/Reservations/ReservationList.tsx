import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Reservation } from "../../interfaces/reservationInterface";
import ReservationCard from "./ReservationCard";
import ReservationForm from "./RerservationForm";
import { createReservations } from "../../Services/reservationService";
import { useReservations } from "../../hooks/useReservations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { reservationStatuses } from "../../constants/reservationStatusList";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useRooms } from "../../hooks/useRooms";
import { useClients } from "../../hooks/useUsers";

interface ReservationListProps {
  reservations: Reservation[];
}

const ReservationList: React.FC<ReservationListProps> = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: accommodations } = useAccommodations();
  const { data: reservations = [] } = useReservations();
  const { data: rooms = [] } = useRooms();
  const { data: clients } = useClients();
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterAccommodation, setFilterAccommodation] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

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
    setShowModal(true);
  };

  const [loading, setLoading] = useState(false);
  const handleSaveReservation = async (reservation: Reservation) => {
    try {
      if (reservation.id) {
        // Actualizar habitación existente
        console.log(reservation);
      } else {
        // Crear nueva habitación
        console.log(reservation);
        await createReservations(reservation);
        queryClient.invalidateQueries({ queryKey: ["reservations"] });
      }

      // Recargar la lista de reservas después de la actualización/creación

      setShowModal(false);
      setEditingReservation(null);
    } catch (error: any) {
      console.error("Error en handleSaveRoom:", error);
      const msg = error?.response?.data?.detail || "Error al guardar reserva";
      toast.error(msg);
      console.log(msg);
    } finally {
      setLoading(false);
    }
  };

  //TODO
  const handleDeleteReservation = (id?: number) => {
    console.log("Eliminar reserva con ID:", id);
  };

  const filteredReservations = reservations.filter((reservation) => {
    return (
      (!filterDateFrom || reservation.start_date >= filterDateFrom) &&
      (!filterDateTo || reservation.end_date <= filterDateTo) &&
      (!filterAccommodation ||
        reservation.accommodation_id === Number(filterAccommodation)) &&
      (!filterRoom || reservation.room_id === roomId) &&
      (!filterCustomer || reservation.user_username === customerName) &&
      (!filterStatus ||
        reservation.status.toLowerCase() === filterStatus.toLowerCase())
    );
  });

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterRoom(value);

    const foundRoom = rooms.find((room) => room.number === value);
    setRoomId(foundRoom?.id ?? null);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterCustomer(value);

    const foundRoom = clients?.find((client) =>
      client.full_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(filterCustomer.toLowerCase())
    );
    setCustomerName(foundRoom?.username ?? null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center my-4">{t("reservations.title")}</h2>

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        {t("reservations.new")}
      </Button>
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
                {t("reservations.until")}
              </Form.Label>
              <Form.Control
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
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
          <Col md={2}>
            <Form.Group>
              <Form.Label style={{ color: "#FFFFFF" }}>{t("room")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("rooms.roomNumber")}
                value={filterRoom}
                onChange={handleRoomChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
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
          <Col md={2}>
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
        <Row className="mt-3">
          <Col className="text-end">
            <Button variant="secondary" onClick={handleClearFilters}>
              {t("clearFilters")}
            </Button>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} md={3} className="g-4">
        {filteredReservations.map((reservation) => (
          <Col key={reservation.id}>
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onDelete={handleDeleteReservation}
            />
          </Col>
        ))}
      </Row>

      <ReservationForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveReservation}
        editingReservation={editingReservation}
      ></ReservationForm>
    </div>
  );
};
export default ReservationList;
