import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  Chart,
} from "chart.js";
import { useDateRange } from "../../../context/DateRangeContext";
import { useRevenueReport } from "../../../hooks/Reports/useRevenueReport";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
  ArcElement
);

const RevenueChart = ({ accommodationId }: { accommodationId: number }) => {
  const { range } = useDateRange();
  const { data: revenueTotal, isLoading } = useRevenueReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading) return <p className="text-muted">Cargando reservas...</p>;
  if (!revenueTotal)
    return <p className="text-danger">No se pudo cargar el reporte.</p>;

  const chartData = {
    labels: ["Ingresos Estimados"],
    datasets: [
      {
        data: [revenueTotal.estimated_revenue],
        backgroundColor: "#1a2a6c",
      },
    ],
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "auto",
          justifyContent: "center",
        }}
      >
        <Doughnut data={chartData} options={{ responsive: true }} />
      </div>
    </>
  );
};

export default RevenueChart;
