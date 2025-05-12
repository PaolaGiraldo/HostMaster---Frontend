import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useClients } from "../../hooks/useUsers";
import { useTranslation } from "react-i18next";
import CustomerTable from "./CustomerTable";
import { User } from "../../interfaces/userInterface";
import { getAccommodations } from "../../Services/accommodationService";
import {
  createClient,
  deleteClient,
  updateClient,
} from "../../Services/userService";
import { useQueryClient } from "@tanstack/react-query";
import CustomerForm from "./CustomerForm";

const ClientsList: React.FC = () => {
  useEffect(() => {
    fetchAccommodations();
  }, []);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading } = useClients();
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [editingClient, seteditingClient] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAccommodations = async () => {
    const response = await getAccommodations();
    setAccommodations(response);
  };

  if (isLoading) {
    return <div>Cargando clientes...</div>;
  }

  const handleEditClient = async (client: User) => {
    try {
      if (client.username === undefined) {
        console.error("Error: El username es undefined.");
        return;
      }
      console.log(client);
      await updateClient(client.username, client);
      seteditingClient(client);
      setShowForm(true);
    } catch (error) {
      console.error("Error updating room type", error);
    }
  };

  const handleDelete = async (username: string) => {
    try {
      if (username === undefined) {
        console.error("Error: El ID de Room es undefined.");
        return;
      }
      console.log(username);
      await deleteClient(username); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  const handleAddOrUpdateClient = async (client: User) => {
    try {
      if (client.username) {
        console.log(client);
        await createClient(client);
      } else {
        console.log(client);
      }

      setShowForm(false);

      queryClient.invalidateQueries({ queryKey: ["clients"] });
      seteditingClient(null);
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

      <CustomerTable
        clients={clients}
        accommodations={accommodations}
        onEdit={handleEditClient}
        onDelete={handleDelete}
      />

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

export default ClientsList;
