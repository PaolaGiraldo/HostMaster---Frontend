import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AccommodationForm from "./AccommodationForm";
import { Accommodation } from "../../interfaces/accommodationInterface";

interface AccommodationTableProps {
  accommodations: Accommodation[];
  onAdd: (accommodation: Accommodation) => void;
  onEdit: (accommodation: Accommodation) => void;
  onDelete: (id: number) => void;
}

const AccommodationTable: React.FC<AccommodationTableProps> = ({
  accommodations,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAccommodation, setEditingAccommodation] =
    useState<Accommodation | null>(null);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<
    number | null
  >(null);

  const handleShowModal = (accommodation: Accommodation | null = null) => {
    setEditingAccommodation(accommodation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccommodation(null);
  };

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

  return (
    <>
      <Button
        variant="primary"
        onClick={() => handleShowModal()}
        className="mb-3"
      >
        {t("accommodations.addNew")}
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>{t("accommodations.name")}</th>
            <th>{t("accommodations.address")}</th>
            <th>{t("accommodations.info")}</th>
            <th>{t("accommodations.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {accommodations.map((accommodation, index) => (
            <tr key={accommodation.id}>
              <td>{index + 1}</td>
              <td>{accommodation.name}</td>
              <td>{accommodation.address}</td>
              <td>{accommodation.information}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(accommodation)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(accommodation.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear/editar alojamientos */}
      <AccommodationForm
        show={showModal}
        onHide={handleCloseModal}
        onSave={editingAccommodation ? onEdit : onAdd}
        editingAccommodation={editingAccommodation}
      />

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
    </>
  );
};

export default AccommodationTable;
