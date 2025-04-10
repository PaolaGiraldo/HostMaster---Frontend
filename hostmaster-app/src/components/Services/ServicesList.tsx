import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ServiceForm from "./ServicesForm";
import { Service } from "../../interfaces/serviceInterface";

import { useTranslation } from "react-i18next";
import { getServices } from "../../Services/serviceService";
import { createService } from "../../Services/serviceService";
import { updateService } from "../../Services/serviceService";
import { deleteService } from "../../Services/serviceService";
import ServiceTable from "./ServicesTable";

const ServiceList: React.FC = () => {
  const { t } = useTranslation();

  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      setServices(response);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleAddOrUpdateService = async (service: Service) => {
    try {
      if (service.id) {
        await updateService(service.id, service);
      } else {
        await createService(service);
      }

      setShowForm(false);
      fetchServices();
      setEditingService(null);
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (id === undefined) {
      console.error("Error: El ID de Service es undefined.");
      return;
    }
    try {
      await deleteService(id);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{t("services.title")}</h2>
      <Button
        onClick={() => {
          setEditingService(null);
          setShowForm(true);
        }}
        className="mb-3"
      >
        {t("services.newService")}
      </Button>
      <ServiceTable
        services={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Modal para Crear/Editar Servicios */}
      <ServiceForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        onSubmit={handleAddOrUpdateService}
        editingService={editingService}
      />
    </div>
  );
};

export default ServiceList;
