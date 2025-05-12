import React, { useState } from "react";
import { Table, Button, OverlayTrigger, Popover, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { User } from "../../interfaces/userInterface";
import { Accommodation } from "../../interfaces/accommodationInterface";

interface ClientTableProps {
  clients: User[];
  accommodations: Accommodation[];
  onEdit: (client: any) => void;
  onDelete: (username: string) => void;
}

const CustomerTable: React.FC<ClientTableProps> = ({
  clients,
  accommodations,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUsername, setSelectedselectedUsername] = useState<
    string | null
  >(null);

  const handleDeleteClick = (username?: string) => {
    setSelectedselectedUsername(username ?? null);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedUsername !== null) {
      onDelete(selectedUsername);
    }
    setShowConfirm(false);
  };

  return (
    <>
      {/* Tabla de habitaciones */}
      <div className="table-responsive">
        <Table striped bordered hover className="room-table">
          <thead>
            <tr>
              <th>{t("clients.name")}</th>
              <th>{t("clients.document")}</th>
              <th>{t("clients.email")}</th>
              <th>{t("clients.reviews")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.username}>
                <td>{client.full_name}</td>

                <td>{client.document_number}</td>
                <td>{client.email}</td>
                <td>
                  {client.reviews.length > 0 ? (
                    <OverlayTrigger
                      trigger="click"
                      placement="left"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">Reseñas</Popover.Header>
                          <Popover.Body>
                            {client.reviews.map((r) => (
                              <div
                                key={r.id}
                                style={{ marginBottom: "0.5rem" }}
                              >
                                <strong>Alojamiento:</strong>{" "}
                                {
                                  accommodations.find(
                                    (a) => a.id === r.accommodation_id
                                  )?.name
                                }
                                <br />
                                <strong>Rating:</strong> {r.rating}/5
                                <br />
                                <strong>Comentario:</strong> {r.comment}
                              </div>
                            ))}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <Button variant="outline-info" size="sm">
                        Ver ({client.reviews.length})
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    "Sin reseñas"
                  )}
                </td>
                <td>
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => onEdit(client)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(client.username)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("clients.confirmDelete")}</Modal.Body>
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

export default CustomerTable;
