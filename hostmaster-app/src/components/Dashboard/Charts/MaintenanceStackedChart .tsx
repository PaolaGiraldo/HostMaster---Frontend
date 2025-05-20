import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Spinner, Table } from "react-bootstrap"; // asegúrate de tener react-bootstrap instalado
import { usePendingMaintenanceReport } from "../../../hooks/Reports/usePendingManteinanceReport";
import { useTranslation } from "react-i18next";
import { relative } from "path";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

  const priorities = ["high", "medium", "low"];
  const statuses = ["pending", "in_progress"];

  const counts = {
    pending: { high: 0, medium: 0, low: 0 },
    in_progress: { high: 0, medium: 0, low: 0 },
  };

  data.pending_maintenances.forEach((task) => {
    const { status, priority } = task;
    if (counts[status] && counts[status][priority] !== undefined) {
      counts[status][priority]++;
    }
  });

  const chartData = {
    labels: [
      t("maintenances.priorityOptions.high"),
      t("maintenances.priorityOptions.medium"),
      t("maintenances.priorityOptions.low"),
    ],
    datasets: [
      {
        label: t("maintenances.statusOptions.pending"),
        data: priorities.map((p) => counts.pending[p]),
        backgroundColor: "#ffc107",
      },
      {
        label: t("maintenances.statusOptions.inProgress"),
        data: priorities.map((p) => counts.in_progress[p]),
        backgroundColor: "#60c4ab",
      },
    ],
  };

  const options = {
    maintainAspectRadio: false,
    responsive: true,
    plugins: {
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const priorityLabels = {
    high: t("maintenances.priorityOptions.high"),
    medium: t("maintenances.priorityOptions.medium"),
    low: t("maintenances.priorityOptions.low"),
  };

  const statusLabels = {
    pending: t("maintenances.statusOptions.pending"),
    in_progress: t("maintenances.statusOptions.inProgress"),
  };

  return (
    <div>
      <div className="chart-container mb-4">
        <Chart type="bar" data={chartData} options={options} />

        <h5 className="mt-4">{t("reports.taskDetails")}</h5>
        <Table striped bordered hover responsive>
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
            {data.pending_maintenances.map((task) => (
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
