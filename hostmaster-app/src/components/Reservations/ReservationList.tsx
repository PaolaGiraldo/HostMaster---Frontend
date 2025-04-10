import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Reservation } from "../../interfaces/reservationInterface";
import ReservationCard from "./ReservationCard";

interface ReservationListProps {
  reservations: Reservation[];
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => {
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

  const handleClearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterAccommodation("");
    setFilterRoom("");
    setFilterCustomer("");
    setFilterStatus("");
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
    setEditingReservation(null);
    setShowModal(false);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowModal(true);
  };

  //TODO
  const handleDeleteReservation = (id?: number) => {
    console.log("Eliminar reserva con ID:", id);
  };

  const filteredReservations = reservations.filter((reservation) => {
    return (
      (!filterDateFrom || reservation.start_date >= filterDateFrom) &&
      (!filterDateTo || reservation.end_date <= filterDateTo) &&
      //(!filterAccommodation || reservation.accommodationId === filterAccommodation) &&
      (!filterRoom || reservation.room_id.toString() === filterRoom) &&
      (!filterCustomer ||
        reservation.user_username
          .toLowerCase()
          .includes(filterCustomer.toLowerCase())) &&
      (!filterStatus ||
        reservation.status.toLowerCase() === filterStatus.toLowerCase())
    );
  });

  return (
    <>
      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        Nueva Reserva
      </Button>
      <Form className="mb-3">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Desde</Form.Label>
              <Form.Control
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Hasta</Form.Label>
              <Form.Control
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Alojamiento</Form.Label>
              <Form.Control
                type="text"
                placeholder="ID o nombre"
                value={filterAccommodation}
                onChange={(e) => setFilterAccommodation(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Habitación</Form.Label>
              <Form.Control
                type="text"
                placeholder="ID o número"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="confirmado">Confirmado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-end">
            <Button variant="secondary" onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
          </Col>
        </Row>
      </Form>
      {filteredReservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteReservation}
        />
      ))}

      {/* Modal de Detalles de Reserva */}
      <Modal show={!!selectedReservation} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <>
              <p>
                <strong>Cliente:</strong> {selectedReservation.user_username}
              </p>
              <p>
                <strong>Alojamiento:</strong>{" "}
                {selectedReservation.accommodation_id}
              </p>
              <p>
                <strong>Habiación:</strong> {selectedReservation.room_id}
              </p>
              <p>
                <strong>Check-in:</strong> {selectedReservation.start_date}
              </p>
              <p>
                <strong>Check-out:</strong> {selectedReservation.end_date}
              </p>

              {selectedReservation.extra_services?.length > 0 ? (
                <p>
                  <strong>Servicios:</strong>{" "}
                  {selectedReservation.extra_services
                    .map((service) => service.name)
                    .join(", ")}
                </p>
              ) : (
                <p>
                  <strong>Servicios:</strong> No hay servicios adicionales.
                </p>
              )}
              <p>
                <strong>Estado:</strong> {selectedReservation.status}
              </p>
              <p>
                <strong>Observaciones:</strong>{" "}
                {selectedReservation.observations}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReservationList;
