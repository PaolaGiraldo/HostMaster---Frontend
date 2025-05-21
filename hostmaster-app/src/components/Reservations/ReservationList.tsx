import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { Reservation } from "../../interfaces/reservationInterface";
import ReservationCard from "./ReservationCard";
import ReservationForm from "./RerservationForm";
import {
  createReservation,
  updateReservation,
} from "../../Services/reservationService";
import { useReservationsOrdered } from "../../hooks/useReservationsOrdered";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { reservationStatuses } from "../../constants/reservationStatusList";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useRooms } from "../../hooks/useRooms";
import { useClients } from "../../hooks/useCustomers";
import { linkMultipleServices } from "../../Services/reservationExtraServicesService";

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

  const [roomId, setRoomId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showCancelled, setShowCancelled] = useState(true);

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

  const completedReservations = useMemo(
    () => filteredReservations(completed),
    [completed]
  );

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterRoom(value);

    const foundRoom = rooms.find((room) => room.number === value);
    setRoomId(foundRoom?.id ?? null);
  };

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
      toast.success("Reserva cancelada correctamente");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    } catch (error) {
      toast.error("Error al cancelar la reserva");
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

        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowReservationForm(true)}
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
                  onChange={handleRoomChange}
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
          <Row className="mt-3">
            <Col className="text-end">
              <Button variant="secondary" onClick={handleClearFilters}>
                {t("clearFilters")}
              </Button>
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
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3">📅 {t("reservations.upcoming")}</h4>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setShowUpcoming((prev) => !prev)}
                >
                  {showUpcoming ? "▲" : "▼"}
                </button>
              </div>

              <Row xs={1} sm={2} md={2} className="g-4">
                {showUpcoming && (
                  <>
                    {filteredReservations(upcoming).length === 0 ? (
                      <p>{t("reservations.noUpcoming")}</p>
                    ) : (
                      filteredReservations(upcoming).map((res: Reservation) => (
                        <Col key={res.id}>
                          <ReservationCard
                            key={res.id}
                            reservation={res}
                            onCancel={handleCancelReservation}
                            onEdit={handleEditReservation}
                          />
                        </Col>
                      ))
                    )}
                  </>
                )}
              </Row>
            </section>

            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3">✅ {t("reservations.completed")}</h4>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setShowCompleted((prev) => !prev)}
                >
                  {showCompleted ? "▲" : "▼"}
                </button>
              </div>

              {showCompleted && (
                <div
                  style={{
                    maxHeight: "630px",
                    overflowY: "auto",
                    paddingRight: "10px",
                  }}
                >
                  <Row xs={1} sm={2} md={2} className="g-4">
                    {completedReservations.length === 0 ? (
                      <p>{t("reservations.noCompleted")}</p>
                    ) : (
                      completedReservations.map((res: Reservation) => (
                        <Col key={res.id}>
                          <ReservationCard
                            reservation={res}
                            onCancel={handleCancelReservation}
                            onEdit={handleEditReservation}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                </div>
              )}
            </section>

            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3">❌ {t("reservations.cancelled")}</h4>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setShowCancelled((prev) => !prev)}
                >
                  {showCancelled ? "▲" : "▼"}
                </button>
              </div>

              <Row
                xs={1}
                sm={2}
                md={2}
                className="g-4"
                style={{
                  width: "100%",
                  height: "630px",
                  overflowX: "auto",
                }}
              >
                {showCancelled && (
                  <>
                    {filteredReservations(cancelled).length === 0 ? (
                      <p>{t("reservations.noCancelled")}</p>
                    ) : (
                      filteredReservations(cancelled).map((res) => (
                        <Col key={res.id}>
                          <ReservationCard
                            key={res.id}
                            reservation={res}
                            onCancel={handleCancelReservation}
                            onEdit={handleEditReservation}
                          />
                        </Col>
                      ))
                    )}
                  </>
                )}
              </Row>
            </section>
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
          {selectedReservation?.user_username}
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
