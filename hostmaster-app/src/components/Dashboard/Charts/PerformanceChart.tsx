import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { useDateRange } from "../../../context/DateRangeContext";
import { usePerformanceReport } from "../../../hooks/Reports/usePerformanceReport";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

const PerformanceChart = ({ accommodationId }: { accommodationId: number }) => {
  const { range } = useDateRange();
  const { data: performance, isLoading } = usePerformanceReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading) return <p className="text-muted">Cargando reservas...</p>;
  if (!performance)
    return <p className="text-danger">No se pudo cargar el reporte.</p>;

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
      },
    },
  };

  return (
    <>
      <Bar
        data={{
          labels: performance.room_bookings.map((item) => item.room_number),
          datasets: [
            {
              label: "Reservas",
              data: performance.room_bookings.map((item) => item.bookings),
              backgroundColor: "#60c4ab",
              borderRadius: 5,
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </>
  );
};

export default PerformanceChart;
