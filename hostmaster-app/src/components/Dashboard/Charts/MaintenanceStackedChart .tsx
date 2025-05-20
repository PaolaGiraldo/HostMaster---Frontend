import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Table } from "react-bootstrap"; // asegúrate de tener react-bootstrap instalado
import { usePendingMaintenanceReport } from "../../../hooks/Reports/usePendingManteinanceReport";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MaintenanceStackedChart = ({
  accommodationId,
}: {
  accommodationId: number;
}) => {
  const { data, isLoading } = usePendingMaintenanceReport(accommodationId);

  if (isLoading) return <p>Cargando tareas...</p>;
  if (!data) return <p>No se pudo cargar el reporte.</p>;

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
    labels: ["Alta", "Media", "Baja"],
    datasets: [
      {
        label: "Pendientes",
        data: priorities.map((p) => counts.pending[p]),
        backgroundColor: "#ffc107",
      },
      {
        label: "En progreso",
        data: priorities.map((p) => counts.in_progress[p]),
        backgroundColor: "#60c4ab",
      },
    ],
  };

  const options = {
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
    high: "Alta",
    medium: "Media",
    low: "Baja",
  };

  const statusLabels = {
    pending: "Pendiente",
    in_progress: "En progreso",
  };

  return (
    <div>
      <Chart type="bar" data={chartData} options={options} />

      <h5 className="mt-4">Detalle de tareas</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Habitación</th>
            <th>Descripción</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Asignado a</th>
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
  );
};

export default MaintenanceStackedChart;
function usePendingManteinanceReport(accommodationId: number): {
  data: any;
  isLoading: any;
} {
  throw new Error("Function not implemented.");
}
