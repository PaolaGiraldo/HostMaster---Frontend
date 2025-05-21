import React, { useState } from "react";
import { Button, Spinner, Col, Form, Row } from "react-bootstrap";
import { useClients } from "../../hooks/useCustomers";
import { useTranslation } from "react-i18next";
import CustomerTable from "./CustomerTable";
import { User } from "../../interfaces/userInterface";
import { createUser, deleteUser, updateUser } from "../../services/userService";
import { useQueryClient } from "@tanstack/react-query";
import CustomerForm from "./CustomerForm";
import { useAccommodations } from "../../hooks/useAccommodations";
import { toast } from "react-toastify";

const CustomersList: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading, error } = useClients();
  const { data: accommodations = [] } = useAccommodations();

  const [editingClient, seteditingClient] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [filterName, setFilterName] = useState("");
  const [filterDocument, setFilterDocument] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  const handleClearFilters = () => {
    setFilterName("");
    setFilterDocument("");
    setFilterEmail("");
  };

  const handleEditClient = async (client: User) => {
    seteditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (username: string) => {
    try {
      if (username === undefined) {
        console.error("Error: El ID de Cliente es undefined.");
        return;
      }
      await deleteUser(username); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente eliminado correctamente");
    } catch (error: any) {
      console.error("Error deleting room", error);
      const msg = error?.response?.data?.detail || "Error al eliminar cliente";
      toast.error(msg);
    }
  };

  const handleAddOrUpdateClient = async (client: User) => {
    try {
      if (editingClient) {
        await updateUser(client.username, client);
      } else {
        await createUser(client);
      }
      setShowForm(false);
      seteditingClient(null);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Información actualizada correctamente");
    } catch (error: any) {
      console.error("Error saving service:", error);
      const msg =
        error?.response?.data?.detail || "Error al actualizar información";
      toast.error(msg);
    }
  };

  const filteredClients = clients?.filter((client) => {
    return (
      (!filterName ||
        client.full_name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(filterName.toLowerCase())) &&
      (!filterDocument || client.document_number.startsWith(filterDocument)) &&
      (!filterEmail || client.email.startsWith(filterEmail))
    );
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center my-4">{t("clients.title")}</h2>

      <Button
        onClick={() => {
          seteditingClient(null);
          setShowForm(true);
        }}
        className="mb-3"
      >
        {t("clients.new")}
      </Button>

      <Form>
        <Row>
          <Col md={3}>
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

          <Col md={3}>
            <Form.Group>
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("clients.document")}
              </Form.Label>
              <Form.Control
                type="number"
                value={filterDocument}
                onChange={(e) => setFilterDocument(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("clients.email")}
              </Form.Label>
              <Form.Control
                type="text"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
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
            clients={filteredClients}
            accommodations={accommodations}
            onEdit={handleEditClient}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal para Crear/Editar Servicios */}
      <CustomerForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleAddOrUpdateClient}
        editingClient={editingClient}
      />
    </div>
  );
};

export default CustomersList;
