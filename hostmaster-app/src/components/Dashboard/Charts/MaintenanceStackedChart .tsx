import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Spinner, Table } from "react-bootstrap";
import { usePendingMaintenanceReport } from "../../../hooks/Reports/usePendingManteinanceReport";
import { useTranslation } from "react-i18next";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Tipos seguros
type Status = "pending" | "in_progress";
type Priority = "high" | "medium" | "low";

interface MaintenanceTask {
  id: number;
  room_number: string;
  description: string;
  priority: Priority;
  status: Status;
  assigned_to: string;
}

const MaintenanceStackedChart = ({
  accommodationId,
}: {
  accommodationId: number;
}) => {
  const { t } = useTranslation();
  const { data, isLoading } = usePendingMaintenanceReport(accommodationId);

  if (isLoading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );

  if (!data.pending_maintenances || data.pending_maintenances.length === 0) {
    return (
      <div style={{ background: "#ffffff ", color: "#1a2a6c" }}>
        <strong>{t("reports.noDataAvailable")}</strong>
      </div>
    );
  }

  const priorities: Priority[] = ["high", "medium", "low"];
  const statuses: Status[] = ["pending", "in_progress"];

  const counts: Record<Status, Record<Priority, number>> = {
    pending: { high: 0, medium: 0, low: 0 },
    in_progress: { high: 0, medium: 0, low: 0 },
  };

  (data.pending_maintenances as MaintenanceTask[]).forEach((task) => {
    const { status, priority } = task;
    counts[status][priority]++;
  });

  const chartData = {
    labels: priorities.map((p) => t(`maintenances.priorityOptions.${p}`)),
    datasets: statuses.map((status) => ({
      label: t(`maintenances.statusOptions.${status}`),
      data: priorities.map((p) => counts[status][p]),
      backgroundColor: status === "pending" ? "#ffc107" : "#60c4ab",
    })),
  };

  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true, // <-- Esto es lo que falta
      },
      y: {
        type: "linear",
        beginAtZero: true,
        position: "left",
        ticks: {
          padding: 10,
        },
        stacked: true,
        grace: "10%",
      },
    },
  };

  const priorityLabels: Record<Priority, string> = {
    high: t("maintenances.priorityOptions.high"),
    medium: t("maintenances.priorityOptions.medium"),
    low: t("maintenances.priorityOptions.low"),
  };

  const statusLabels: Record<Status, string> = {
    pending: t("maintenances.statusOptions.pending"),
    in_progress: t("maintenances.statusOptions.inProgress"),
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        gap: "1rem",
        background: "#ffffff",
        color: "#3a3a3a",
      }}
    >
      <div
        className="chart-container"
        style={{
          width: "50%",

          flex: "1 1 48%",
          minWidth: "300px",
        }}
      >
        <Chart type="bar" data={chartData} options={options} />
      </div>

      <div
        style={{
          width: "50%",

          flex: "1 1 48%",
          minWidth: "300px",
          overflowX: "auto",
        }}
      >
        <h6>{t("reports.taskDetails")}</h6> {" "}
        <Table striped bordered hover responsive style={{ fontSize: "0.9rem" }}>
          <thead>
            <tr>
              <th>{t("room")}</th>
              <th>{t("description")}</th>
              <th>{t("maintenances.priority")}</th>
              <th>{t("maintenances.status")}</th>
              <th>{t("maintenances.responsible")}</th>
            </tr>
          </thead>
          <tbody>
            {(data.pending_maintenances as MaintenanceTask[]).map((task) => (
              <tr key={task.id}>
                <td>{task.room_number}</td>
                <td>{task.description}</td>
                <td>{priorityLabels[task.priority]}</td>
                <td>{statusLabels[task.status]}</td>
                <td>{task.assigned_to}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenanceStackedChart;
