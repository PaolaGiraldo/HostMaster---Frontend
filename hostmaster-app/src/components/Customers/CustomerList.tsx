import React, { useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useClients } from "../../hooks/useCustomers";
import { useTranslation } from "react-i18next";
import CustomerTable from "./CustomerTable";
import { User } from "../../interfaces/userInterface";
import { createUser, deleteUser, updateUser } from "../../Services/userService";
import { useQueryClient } from "@tanstack/react-query";
import CustomerForm from "./CustomerForm";
import { useAccommodations } from "../../hooks/useAccommodations";

const CustomersList: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading, error } = useClients();
  const { data: accommodations = [] } = useAccommodations();

  const [editingClient, seteditingClient] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

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
    } catch (error) {
      console.error("Error deleting room", error);
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
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  return (
    <Container>
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
          clients={clients}
          accommodations={accommodations}
          onEdit={handleEditClient}
          onDelete={handleDelete}
        />
      )}

      {/* Modal para Crear/Editar Servicios */}
      <CustomerForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleAddOrUpdateClient}
        editingClient={editingClient}
      />
    </Container>
  );
};

export default CustomersList;
