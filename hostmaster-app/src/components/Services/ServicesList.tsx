import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import ServiceForm from "./ServicesForm";
import { Service } from "../../interfaces/serviceInterface";

import { useTranslation } from "react-i18next";
import { createService } from "../../services/serviceService";
import { updateService } from "../../services/serviceService";
import { deleteService } from "../../services/serviceService";
import ServiceTable from "./ServicesTable";
import { useServices } from "../../hooks/useServices";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ServiceList: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  const { data: services = [], isLoading, error } = useServices();

  const handleAddOrUpdateService = async (service: Service) => {
    try {
      if (service.id) {
        await updateService(service.id, service);
      } else {
        await createService(service);
      }

      setShowForm(false);
      setEditingService(null);

      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Servicio guardado correctamente");
    } catch (error: any) {
      console.error("Error saving service:", error);
      const msg = error?.response?.data?.detail || "Error al guardar Servicio";
      toast.error(msg);
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

      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Servicio eliminado correctamente");
    } catch (error: any) {
      console.error("Error deleting service:", error);

      const msg = error?.response?.data?.detail || "Error al eliminar servicio";
      toast.error(msg);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center my-4">{t("services.title")}</h2>

      <Button
        onClick={() => {
          setEditingService(null);
          setShowForm(true);
        }}
        className="mb-3"
      >
        {t("services.newService")}
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
        <ServiceTable
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
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
