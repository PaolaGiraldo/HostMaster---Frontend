import React, { useState } from "react";
import { Table, Button, OverlayTrigger, Popover, Modal } from "react-bootstrap";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { User } from "../../interfaces/userInterface";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { userRoleList } from "../../constants/userRolesList";

interface UserTableProps {
  users: User[];
  accommodations: Accommodation[];
  onEdit: (user: any) => void;
  onDelete: (username: string) => void;
}

const CustomerTable: React.FC<UserTableProps> = ({
  users,
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
              <th>{t("users.username")}</th>
              <th>{t("users.name")}</th>
              <th>{t("users.document")}</th>
              <th>{t("users.email")}</th>
              <th>{t("users.phone")}</th>
              <th>{t("users.role")}</th>
              <th>{t("users.active")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.document_number}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>
                  {userRoleList
                    .filter((role) => role.value === user.role)
                    .map((role) => t(role.labelKey))}
                </td>
                <td>
                  {!user.disabled ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>

                <td>
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => onEdit(user)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(user.username)}
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
        <Modal.Body>{t("users.confirmDelete")}</Modal.Body>
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
