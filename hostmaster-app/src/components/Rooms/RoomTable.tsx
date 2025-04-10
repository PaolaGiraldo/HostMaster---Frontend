// RoomTable.tsx - Componente para mostrar la tabla de habitaciones con filtros y estilos
import React, { useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { Room } from "../../interfaces/roomInterface";
import { Image } from "../../interfaces/imageInterface";

interface RoomTableProps {
  rooms: Room[];
  accommodations: Accommodation[];
  roomTypes: any[];
  onEdit: (room: any) => void;
  onDelete: (roomId: number) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms,
  accommodations,
  roomTypes,
  onEdit,
  onDelete,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [filterAvailability] = useState<string>("");
  const [filterType] = useState<string>("");
  const [searchRoomNumber, setSearchRoomNumber] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleDeleteClick = (roomId?: number) => {
    setSelectedRoomId(roomId ?? null);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedRoomId !== null) {
      onDelete(selectedRoomId);
    }
    setShowConfirm(false);
  };

  const { t } = useTranslation();
  // Filtrar habitaciones
  const filteredRooms = rooms.filter((room) => {
    return (
      (filterAvailability === "" ||
        String(room.isAvailable) === filterAvailability) &&
      (filterType === "" || room.type_id) &&
      (searchRoomNumber === "" ||
        String(room.number).startsWith(searchRoomNumber))
    );
  });

  const openImageModal = (images: Image[]) => {
    const imageUrls = images.map((img) => img.url);
    setSelectedImages(imageUrls);
    setShowModal(true);
  };

  const closeImageModal = () => {
    setShowModal(false);
  };
  return (
    <>
      {/* Filtros */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>{t("rooms.filterNumber")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("rooms.InsertNumber")}
              value={searchRoomNumber}
              onChange={(e) => setSearchRoomNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Tabla de habitaciones */}
      <Table striped bordered hover className="room-table">
        <thead>
          <tr>
            <th>{t("accommodation")}</th>
            <th>{t("number")}</th>
            <th>{t("type")}</th>
            <th>{t("image")}</th>
            <th>{t("price")}</th>
            <th>{t("availability")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id}>
              <td>
                {accommodations.find((a) => a.id === room.accommodation_id)
                  ?.name || "N/A"}
              </td>

              <td>{room.number}</td>
              <td>
                {roomTypes.find((rt) => rt.id === room.type_id)?.name || "N/A"}
              </td>
              <td>
                {room.images.length > 0 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openImageModal(room.images)}
                  >
                    {t("showImages")}
                  </Button>
                ) : (
                  <span>{t("noImages")}</span>
                )}
              </td>
              <td>{room.price.toFixed()}</td>
              <td>
                {room.isAvailable ? (
                  <FaCheck color="green" />
                ) : (
                  <FaTimes color="red" />
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(room)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(room.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("rooms.confirmDelete")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={closeImageModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("rooms.roomImages")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImages.length > 0 ? (
            <div className="image-container">
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Room image ${index + 1}`}
                  className="modal-image"
                />
              ))}
            </div>
          ) : (
            <p>{t("noImage")}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoomTable;
