import React, { useState } from "react";
import { Button, Spinner, Form, Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import CustomerTable from "./UserTable";
import { User } from "../../interfaces/userInterface";
import { createUser, deleteUser, updateUser } from "../../Services/userService";
import { useQueryClient } from "@tanstack/react-query";
import CustomerForm from "./UserForm";
import { useUsers } from "../../hooks/useUsers";
import { userRoleList } from "../../constants/userRolesList";
import { useAccommodations } from "../../hooks/useAccommodations";

const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const queryUser = useQueryClient();
  const { data: users = [], isLoading, error } = useUsers();
  const [editingUser, seteditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [filterRole, setFilterRole] = useState("");
  const [filterName, setFilterName] = useState("");

  const handleClearFilters = () => {
    setFilterName("");
    setFilterRole("");
  };

  const { data: accommodations } = useAccommodations();

  const handleEditUser = async (user: User) => {
    seteditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (username: string) => {
    try {
      if (username === undefined) {
        console.error("Error: El ID de Room es undefined.");
        return;
      }
      await deleteUser(username); // Llamado al backend
      queryUser.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  const handleAddOrUpdateUser = async (user: User) => {
    try {
      if (editingUser) {
        await updateUser(user.username, user);
      } else {
        await createUser(user);
      }

      setShowForm(false);
      seteditingUser(null);
      queryUser.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const filteredUsers = users?.filter((user) => {
    return (
      (!filterName ||
        user.full_name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(filterName.toLowerCase())) &&
      (!filterRole || user.role === filterRole.toLowerCase())
    );
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center my-4">{t("users.title")}</h2>

      <Button
        onClick={() => {
          seteditingUser(null);
          setShowForm(true);
        }}
        className="mb-3"
      >
        {t("users.new")}
      </Button>

      <Form>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("users.role")}
              </Form.Label>
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">{t("all1")}</option>
                {userRoleList.map((role) => (
                  <option key={role.value} value={role.value}>
                    {t(role.labelKey)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("clients.name")}
              </Form.Label>
              <Form.Control
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" onClick={handleClearFilters}>
              {t("clearFilters")}
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="container py-4">
        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" />
            <div>{t("loading")}</div>
          </div>
        ) : error ? (
          <div className="text-center text-danger">
            {t("accommodations.loadError")}
          </div>
        ) : (
          <CustomerTable
            users={filteredUsers}
            accommodations={accommodations!}
            onEdit={handleEditUser}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal para Crear/Editar Servicios */}
      <CustomerForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleAddOrUpdateUser}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UsersList;
