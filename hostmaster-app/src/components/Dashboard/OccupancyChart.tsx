import { Bar, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Interaction,
} from "chart.js";
import { useOccupancyReport } from "../../hooks/useOccupancyReport";
import { useDateRange } from "../../context/DateRangeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

const OccupancyChart = ({ accommodationId }: { accommodationId: number }) => {
  const { range } = useDateRange();
  const { data, isLoading } = useOccupancyReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading) return <p className="text-muted">Cargando reservas...</p>;
  if (!data)
    return <p className="text-danger">No se pudo cargar el reporte.</p>;

  const chartData = {
    labels: data.occupancy_data.map((item) => item.date),
    datasets: [
      {
        type: "bar",
        label: "Habitaciones Ocupadas",
        data: data.occupancy_data.map((item) => item.occupied_rooms),
        backgroundColor: "#60c4ab",
        borderRadius: 5,
      },

      {
        type: "line",
        label: "Tasa de ocupación",
        data: data.occupancy_data.map((item) => item.occupancy_rate),
        borderColor: "#ff6384",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        suggestedMax: 100,
      },
    },
  };

  return (
    <>
      <Chart type="bar" data={chartData} options={options} />;
    </>
  );
};

export default OccupancyChart;
