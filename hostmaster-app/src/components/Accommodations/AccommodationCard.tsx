import React, { useState } from "react";
import { Card, ListGroup, Button, Modal, Carousel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Accommodation } from "../../interfaces/accommodationInterface";
interface AccommodationCardProps {
  accommodation: Accommodation;
  onEdit: (accommodation: any) => void;
  onDelete: (id?: number) => void;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<
    number | null
  >(null);

  const handleDeleteClick = (accommodationId?: number) => {
    setSelectedAccommodationId(accommodationId ?? null);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedAccommodationId !== null) {
      onDelete(selectedAccommodationId);
    }
    setShowConfirm(false);
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <Card className="accommodation-card">
      {accommodation.images.length > 0 && (
        <Card.Img
          variant="top"
          src={accommodation.images[0].url}
          alt={accommodation.name}
          style={{ cursor: "pointer", height: "200px", objectFit: "cover" }}
          onClick={() => setShowModal(true)}
        />
      )}
      <Card.Body>
        <Card.Title>{accommodation.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {accommodation.address} - {accommodation.cityName}
        </Card.Subtitle>

        <Card.Text>{accommodation.information}</Card.Text>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          disabled={accommodation.images.length === 0}
        >
          {t("viewImages")}
        </Button>
        <div className="mb-3"></div>
        <h6>{t("accommodations.rooms")}:</h6>
        {/* Lista de habitaciones */}
        {accommodation.rooms.length > 0 ? (
          <ListGroup variant="flush">
            {accommodation.rooms.map((room: any) => (
              <ListGroup.Item
                key={room.id}
                className={room.isAvailable ? "" : "text-danger"} // Aplica la clase si no está disponible
              >
                <li key={room.id}>
                  {room.isAvailable ? "🟢" : "🔴"} {t("room")} {room.number} -{" "}
                  {room.roomType.name}
                </li>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted">{t("accommodations.noRooms")}</p>
        )}
        <div className="mb-4"></div>
        <div className="d-flex justify-content-between ">
          <Button variant="primary" onClick={() => onEdit(accommodation)}>
            {t("edit")}
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteClick(accommodation.id)}
          >
            {t("delete")}
          </Button>
        </div>
      </Card.Body>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("accommodations.confirmDelete")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal con Carrusel */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <Carousel>
            {accommodation.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image.url}
                  alt={`${t("image")} ${index}`}
                  style={{ width: "100%" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default AccommodationCard;
