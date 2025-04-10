// RoomTypeTable.tsx - Componente para la gestión de tipos de habitación
import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { RoomType } from "../../interfaces/roomTypeInterface";

interface RoomTypeTableProps {
  roomTypes: RoomType[];
  onAdd: (roomType: RoomType) => void;
  onEdit: (roomType: RoomType) => void;
  onDelete: (id?: number) => void;
}

const RoomTypeTable: React.FC<RoomTypeTableProps> = ({
  roomTypes,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(
    null
  );

  const handleShowModal = (roomType: RoomType | null = null) => {
    setEditingRoomType(roomType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoomType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRoomType) {
      console.error("No room type data provided");
      return;
    }

    try {
      if (editingRoomType.id) {
        onEdit(editingRoomType);
      } else {
        await onAdd({
          name: editingRoomType.name,
          description: editingRoomType.description,
          max_guests: editingRoomType.max_guests,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving room type", error);
    }
  };

  const handleDeleteClick = (roomTypeId?: number) => {
    setSelectedRoomTypeId(roomTypeId ?? null);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedRoomTypeId !== null) {
      onDelete(selectedRoomTypeId);
    }
    setShowConfirm(false);
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => handleShowModal()}
        className="mb-3"
      >
        {t("roomTypes.addNew")}
      </Button>

      <Table striped bordered hover className="room-type-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("roomTypes.type")}</th>
            <th>{t("roomTypes.description")}</th>
            <th>{t("roomTypes.maxCapacity")}</th>
            <th>{t("roomTypes.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((roomType, index) => (
            <tr key={roomType.id}>
              <td>{index + 1}</td>
              <td>{roomType.name}</td>
              <td>{roomType.description}</td>
              <td>{roomType.max_guests}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(roomType)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(roomType.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear/editar tipos de habitación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRoomType ? t("roomTypes.edit") : t("roomTypes.addNew")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t("roomTypes.type")}</Form.Label>
              <Form.Control
                type="text"
                value={editingRoomType?.name || ""}
                onChange={(e) =>
                  setEditingRoomType({
                    ...editingRoomType!,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("roomTypes.description")}</Form.Label>
              <Form.Control
                as="textarea"
                value={editingRoomType?.description || ""}
                onChange={(e) =>
                  setEditingRoomType({
                    ...editingRoomType!,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("roomTypes.maxCapacity")}</Form.Label>
              <Form.Control
                type="number"
                value={editingRoomType?.max_guests || ""}
                onChange={(e) =>
                  setEditingRoomType({
                    ...editingRoomType!,
                    max_guests: Number(e.target.value),
                  })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {t("roomTypes.save")}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("roomTypes.confirmDelete")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoomTypeTable;
