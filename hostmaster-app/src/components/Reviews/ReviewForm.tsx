import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { getReservations } from "../../Services/reservationService";
import { Reservation } from "../../interfaces/reservationInterface";
import { useForm, Controller } from "react-hook-form";
import { Review } from "../../interfaces/reviewInterface";
import { Accommodation } from "../../interfaces/accommodationInterface";

interface ReviewFormProps {
  show: boolean;
  onClose: () => void;
  onSave: (room: Review) => void;
  accommodations: Accommodation[];
}

export const ReviewForm = ({
  show,
  onClose,
  onSave,
  accommodations,
}: ReviewFormProps) => {
  const { t } = useTranslation();
  const [reservationCode, setReservationCode] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState("");

  const { control, handleSubmit: handleRatingSubmit } = useForm();
  const [selectedRating, setSelectedRating] = useState(0);

  const handleStarClick = (value: number) => {
    setSelectedRating(value);
  };

  const { register, handleSubmit, reset } = useForm<Review>();

  const validateReservation = async () => {
    try {
      const allReservations = await getReservations();
      const found = allReservations.find(
        (r) => r.id === Number(reservationCode)
      );
      if (found) {
        setReservation(found);
        setError("");
      } else {
        setReservation(null);
        setError("Código de reserva no válido.");
      }
    } catch (err) {
      setError("Error al validar la reserva.");
    }
  };

  const onSubmit = async (data: Review) => {
    onSave({
      ...data,
      accommodation_id: reservation?.accommodation_id!,
      user_username: reservation?.user_username!,
      rating: selectedRating,
    });
    reset();
    setReservation(null);
    setReservationCode("");
    setSelectedRating(0);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("reviews.addReview")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!reservation ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>{t("reviews.reservationCode")}</Form.Label>
              <Form.Control
                type="number"
                value={reservationCode}
                onChange={(e) => setReservationCode(e.target.value)}
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button onClick={validateReservation}>
              {t("reviews.validate")}
            </Button>
          </>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <p>
              {t("accommodation")}:{" "}
              <strong>
                {
                  accommodations.find(
                    (a) => a.id === reservation.accommodation_id
                  )?.name
                }
              </strong>
            </p>
            <Form.Group className="mb-3">
              <Form.Label>{t("reviews.rating")}</Form.Label>

              <Controller
                name="rating"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <div>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <i
                        key={value}
                        className={`bi ${
                          value <= selectedRating
                            ? "bi-star-fill text-warning"
                            : "bi-star text-muted"
                        }`}
                        style={{
                          fontSize: "1.5rem",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                        onClick={() => {
                          setSelectedRating(value);
                          field.onChange(value);
                        }}
                      />
                    ))}
                  </div>
                )}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("reviews.commments")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("comment", { required: true })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={onClose} className="me-2">
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Enviar reseña
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};
