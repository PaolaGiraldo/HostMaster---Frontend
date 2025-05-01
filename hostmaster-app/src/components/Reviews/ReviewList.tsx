import React, { useState } from "react";
import { Card, Form, Button, Spinner, Modal, Alert } from "react-bootstrap";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useAllAccommodationReviews } from "../../hooks/useReviews";
import { useAccommodations } from "../../hooks/useAccommodations";
import { getReservationById } from "./getReservationById";
import { Reservation } from "../../interfaces/reservationInterface";
import ReviewCard from "./ReviewCard";

type Filter = {
  accommodationId?: number;
  user?: string;
  date?: string;
  rating?: number;
};

export const ReviewList = () => {
  const { t } = useTranslation();
  const { data: accommodations = [] } = useAccommodations();
  const accommodationIds = accommodations
    .map((a) => a.id)
    .filter((id): id is number => typeof id === "number");
  const { data: allReviews = [], isLoading } =
    useAllAccommodationReviews(accommodationIds);
  const [filters, setFilters] = useState<Filter>({
    accommodationId: 0,
    user: "",
    date: "",
    rating: 0,
  });

  const filteredReviews = allReviews.filter((review) => {
    const matchesAccommodation = filters.accommodationId
      ? review.accommodation_id === filters.accommodationId
      : true;
    const matchesUser = filters.user
      ? review.user_username.includes(filters.user)
      : true;
    const matchesDate = filters.date
      ? review.created_at.startsWith(filters.date)
      : true;
    const matchesRating = filters.rating
      ? review.rating === filters.rating
      : true;
    return matchesAccommodation && matchesUser && matchesDate && matchesRating;
  });

  const handleClearFilters = () => {
    setFilters({
      accommodationId: 0,
      user: "",
      date: "",
      rating: 0,
    });
  };

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reservationCode, setReservationCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
    setReservationCode("");
    setIsCodeValid(false);
    setReservation(null);
  };

  const handleCheckCode = async () => {
    setIsCheckingCode(true);
    try {
      const result = await getReservationById(Number(reservationCode)); // tu función de validación
      if (result) {
        setIsCodeValid(true);
        setReservation(result);
      } else {
        <Alert variant="error">Código de reserva inválido.</Alert>;
      }
    } catch (error) {
      console.error("Error al validar código de reserva", error);
    } finally {
      setIsCheckingCode(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" role="status" />
        <div className="mt-2">Cargando reseñas...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">{t("reviews.title")}</h2>

      <Button variant="primary" onClick={handleOpenReviewModal}>
        <i className="bi bi-pencil-square"></i> Agregar reseña
      </Button>

      <Form className="row g-2 mb-3">
        <Form.Group className="col-md-3">
          <Form.Label style={{ color: "#FFFFFF" }}>Alojamiento</Form.Label>
          <Form.Select
            value={filters.accommodationId}
            onChange={(e) =>
              setFilters({
                ...filters,
                accommodationId: Number(e.target.value),
              })
            }
          >
            <option value="">Todos</option>
            {accommodations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* <Form.Group className="col-md-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            value={filters.user}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
          />
        </Form.Group> */}

        <Form.Group className="col-md-3">
          <Form.Label style={{ color: "#FFFFFF" }}>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="col-md-3">
          <Form.Label style={{ color: "#FFFFFF" }}>Calificación</Form.Label>
          <Form.Select
            value={filters.rating}
            onChange={(e) =>
              setFilters({ ...filters, rating: Number(e.target.value) })
            }
          >
            <option value="">Todas</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="col-md-2 d-flex align-items-end">
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            className="w-100 d-flex align-items-center justify-content-center gap-2"
            title="Limpiar filtros"
          >
            <i className="bi bi-x-circle"></i> Limpiar
          </Button>
        </Form.Group>
      </Form>

      <div className="review-list">
        {filteredReviews.map((review) => (
          <ReviewCard review={review} />
        ))}
      </div>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar reseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isCodeValid ? (
            <>
              <Form.Group>
                <Form.Label>Ingrese el código de reserva</Form.Label>
                <Form.Control
                  type="text"
                  value={reservationCode}
                  onChange={(e) => setReservationCode(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="success"
                className="mt-3"
                onClick={handleCheckCode}
                disabled={isCheckingCode}
              >
                {isCheckingCode ? "Verificando..." : "Validar código"}
              </Button>
            </>
          ) : (
            <>
              <p>
                <strong>Reserva encontrada:</strong>{" "}
                {reservation?.user_username}
              </p>
              {/* Aquí luego irá el formulario real de reseña */}
              <Alert variant="success">
                Código válido. Puedes agregar tu reseña.
              </Alert>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
