import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMaintenances } from "../../hooks/useMaintenances";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { reservationStatuses } from "../../constants/reservationStatusList";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useRooms } from "../../hooks/useRooms";
import { useStaff } from "../../hooks/useStaff";
import { Maintenance } from "../../interfaces/maintenanceInterface";
import MaintenanceTable from "./MaintenanceTable";
import MaintenanceForm from "./MaintenanceForm";
import { toast } from "react-toastify";
import {
  createMaintenance,
  updateMaintenance,
} from "../../services/maintenanceServices";

interface MaintenanceListProps {}

const MaintenanceList: React.FC<MaintenanceListProps> = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: maintenances = [], isLoading, error } = useMaintenances();
  const { data: rooms = [], isLoading: isLoadingRooms } = useRooms();
  const { data: accommodations = [], isLoading: isLoadingAccommodations } =
    useAccommodations();
  const { data: staff = [], isLoading: LoadingStaff } = useStaff();

  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<any | null>(
    null
  );

  const [filterDateCreatedFrom, setFilterDateCreatedFrom] = useState("");
  const [filterDateCreatedTo, setFilterDateCreatedTo] = useState("");
  const [filterAccommodation, setFilterAccommodation] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterResponsible, setFilterResponsible] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const [roomId, setRoomId] = useState<number | null>(null);
  const [responsiblerName, setResponsibleName] = useState<string | null>(null);

  const handleClearFilters = () => {
    setFilterDateCreatedFrom("");
    setFilterDateCreatedTo("");
    setFilterAccommodation("");
    setFilterRoom("");
    setFilterResponsible("");
    setFilterStatus("");
    setFilterPriority("");
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterRoom(value);

    const foundRoom = rooms.find((room) => room.number === value);
    setRoomId(foundRoom?.id ?? null);
  };

  const handleResponsibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterResponsible(value);

    const foundUser = staff?.find((client: { full_name: string }) =>
      client.full_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(filterResponsible.toLowerCase())
    );
    setResponsibleName(foundUser?.username ?? null);
  };

  const filteredMaintenances = maintenances.filter((maintenance) => {
    return (
      (!filterDateCreatedFrom ||
        maintenance.created_at >= filterDateCreatedFrom) &&
      (!filterDateCreatedTo || maintenance.created_at <= filterDateCreatedTo) &&
      (!filterAccommodation ||
        maintenance.accommodation_id === Number(filterAccommodation)) &&
      (!filterRoom || maintenance.room_id === roomId) &&
      (!filterResponsible || maintenance.assigned_to === responsiblerName) &&
      (!filterStatus ||
        maintenance.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (!filterPriority ||
        maintenance.priority.toLowerCase() === filterPriority.toLowerCase())
    );
  });

  const handleDeleteRoom = async (roomId: number) => {
    try {
      if (roomId === undefined) {
        console.error("Error: El ID de Room es undefined.");
        return;
      }
      //await deleteRoom(roomId); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  const handleSaveMaintenance = async (maintenance: Maintenance) => {
    try {
      if (maintenance.id) {
        await updateMaintenance(maintenance.id, maintenance);
      } else {
        await createMaintenance(maintenance);
      }

      // Recargar la lista de reservas después de la actualización/creación
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    } catch (error: any) {
      console.error("Error en handleSaveMaintenance:", error);
      const msg = error?.response?.data?.detail || "Error al guardar reserva";
      toast.error(msg);
    }
  };

  const handleCloseMaintenanceForm = () => {
    setShowMaintenanceForm(false);
    setEditingMaintenance(null); // ✅ Limpiar la reserva en edición
  };

  if (isLoadingRooms || isLoadingAccommodations || LoadingStaff || isLoading) {
    return (
      <div className="text-center my-5">
        <h2 className="text-center my-4">{t("rooms.title")}</h2>
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center my-4">{t("maintenances.title")}</h2>

        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowMaintenanceForm(true)}
        >
          {t("maintenances.new")}
        </Button>

        <Form className="mb-3">
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("maintenances.from")}
                </Form.Label>
                <Form.Control
                  type="date"
                  value={filterDateCreatedFrom}
                  onChange={(e) => setFilterDateCreatedFrom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("maintenances.to")}
                </Form.Label>
                <Form.Control
                  type="date"
                  value={filterDateCreatedTo}
                  onChange={(e) => setFilterDateCreatedTo(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("accommodation")}
                </Form.Label>
                <Form.Select
                  value={filterAccommodation}
                  onChange={(e) => setFilterAccommodation(e.target.value)}
                >
                  <option value="">{t("all1")}</option>
                  {accommodations?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("room")}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("rooms.roomNumber")}
                  value={filterRoom}
                  onChange={handleRoomChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("maintenances.responsible")}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("clients.name")}
                  value={filterResponsible}
                  onChange={handleResponsibleChange}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("maintenances.status")}
                </Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">{t("all1")}</option>
                  {reservationStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {t(status.labelKey)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ color: "#FFFFFF" }}>
                  {t("maintenances.priority")}
                </Form.Label>
                <Form.Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="">{t("all1")}</option>
                  {reservationStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {t(status.labelKey)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="text-end">
              <Button variant="secondary" onClick={handleClearFilters}>
                {t("clearFilters")}
              </Button>
            </Col>
          </Row>
        </Form>

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
          <div>
            <MaintenanceTable
              maintenances={filteredMaintenances}
              accommodations={accommodations}
              rooms={rooms}
              staff={staff}
              onEdit={(maintenance) => {
                setEditingMaintenance(maintenance);
                setShowMaintenanceForm(true);
              }}
              onDelete={handleDeleteRoom}
            />
          </div>
        )}

        <MaintenanceForm
          show={showMaintenanceForm}
          onHide={handleCloseMaintenanceForm}
          onSave={handleSaveMaintenance}
          editingMaintenance={editingMaintenance}
          accommodations={accommodations}
          staff={staff}
        ></MaintenanceForm>
      </div>
    </>
  );
};
export default MaintenanceList;
