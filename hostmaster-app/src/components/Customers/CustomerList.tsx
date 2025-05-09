import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useClients } from "../../hooks/useUsers";
import { useTranslation } from "react-i18next";
import CustomerTable from "./CustomerTable";
import { User } from "../../interfaces/userInterface";
import { getAccommodations } from "../../Services/accommodationService";

const ClientsList: React.FC = () => {
  useEffect(() => {
    fetchAccommodations();
  }, []);
  const { t } = useTranslation();
  const { data: clients = [], isLoading } = useClients();
  const [accommodations, setAccommodations] = useState<any[]>([]);

  const fetchAccommodations = async () => {
    const response = await getAccommodations();
    setAccommodations(response);
  };

  if (isLoading) {
    return <div>Cargando clientes...</div>;
  }

  const handleEditRoom = (client: User) => {
    console.log(client);
  };

  const handleDelete = async (username: string) => {
    try {
      if (username === undefined) {
        console.error("Error: El ID de Room es undefined.");
        return;
      }
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  return (
    <Container>
      <h2 className="text-center my-4">{t("clients.title")}</h2>
      <CustomerTable
        clients={clients}
        accommodations={accommodations}
        onEdit={handleEditRoom}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default ClientsList;
