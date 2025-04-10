import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Service } from "../../interfaces/serviceInterface";

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  const handleDeleteClick = (serviceId?: number) => {
    setSelectedServiceId(serviceId ?? null);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedServiceId !== null) {
      onDelete(selectedServiceId);
    }
    setShowConfirm(false);
  };

  return (
    <>
      <Table striped bordered hover className="room-table">
        <thead>
          <tr>
            <th>{t("Id")}</th>
            <th>{t("services.service")}</th>
            <th>{t("description")}</th>
            <th>{t("price")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>${service.price}</td>
              <td>
                <Button variant="warning" onClick={() => onEdit(service)}>
                  <FaEdit />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(service.id)}
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

export default ServiceTable;
