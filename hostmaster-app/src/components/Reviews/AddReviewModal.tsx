import React, { useState } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { Review } from "../../interfaces/reviewInterface";
import { Reservation } from "../../interfaces/reservationInterface";
import { getReservationById } from "./getReservationById";

type AddReviewModalProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: Review) => void;
};

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  show,
  onClose,
  onSubmit,
}) => {
  const [reservationCode, setReservationCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);

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
  return (
    <Modal show={show} onHide={onClose}>
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
              <strong>Reserva encontrada:</strong> {reservation?.user_username}
            </p>
            {/* Aquí luego irá el formulario real de reseña */}
            <Alert variant="success">
              Código válido. Puedes agregar tu reseña.
            </Alert>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddReviewModal;
