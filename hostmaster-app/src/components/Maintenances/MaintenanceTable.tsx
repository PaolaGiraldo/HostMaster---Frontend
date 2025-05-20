import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { Room } from "../../interfaces/roomInterface";
import { Maintenance } from "../../interfaces/maintenanceInterface";
import { User } from "../../interfaces/userInterface";
import {
  maintenancePriorities,
  maintenanceStatuses,
} from "../../constants/maintenanceStatusList";

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  rooms: Room[];
  accommodations: Accommodation[];
  staff: User[];
  onEdit: (room: any) => void;
  onDelete: (roomId: number) => void;
}
const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
  rooms,
  maintenances,
  accommodations,
  staff,
  onEdit,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="table-responsive">
        <Table striped bordered hover className="room-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("accommodation")}</th>
              <th>{t("maintenances.roomNumber")}</th>
              <th>{t("maintenances.created")}</th>
              <th>{t("maintenances.responsible")}</th>
              <th>{t("maintenances.priority")}</th>
              <th>{t("maintenances.status")}</th>
              <th>{t("maintenances.updated")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>{maintenance.id}</td>
                <td>
                  {accommodations.find(
                    (a) => a.id === maintenance.accommodation_id
                  )?.name || "N/A"}
                </td>

                <td>
                  {rooms.find((a) => a.id === maintenance.room_id)?.number ||
                    "N/A"}
                </td>
                <td>{maintenance.created_at}</td>
                <td>
                  {staff.find((a) => a.username === maintenance.assigned_to)
                    ?.full_name || "N/A"}
                </td>
                <td>
                  {maintenancePriorities
                    .filter(
                      (priority) => priority.value === maintenance.priority
                    )
                    .map((priority) => t(priority.labelKey))}{" "}
                </td>
                <td>
                  {maintenanceStatuses
                    .filter((status) => status.value === maintenance.status)
                    .map((status) => t(status.labelKey))}{" "}
                </td>
                <td>{maintenance.updated_at}</td>

                <td>
                  {maintenance.status !== "completed" && (
                    <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => onEdit(maintenance)}
                      >
                        <FaEdit />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default MaintenanceTable;
