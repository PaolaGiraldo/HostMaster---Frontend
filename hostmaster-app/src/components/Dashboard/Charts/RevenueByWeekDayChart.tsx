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
import { useRevenueByWeekDayReport } from "../../../hooks/Reports/useRevenueByWeekDayReport";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

const RevenueByWeekDayChart = ({
  accommodationId,
}: {
  accommodationId: number;
}) => {
  const { range } = useDateRange();
  const { data, isLoading } = useRevenueByWeekDayReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading) return <p className="text-muted">Cargando reservas...</p>;
  if (!data)
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
        suggestedMax: 100,
      },
    },
  };

  return (
    <>
      <Bar
        data={{
          labels: data.top_revenue_days.map((item) => item.weekday),
          datasets: [
            {
              type: "bar",
              label: "Ingresos por dia de la semana",
              data: data.top_revenue_days.map((item) => item.total_revenue),
              backgroundColor: "#60c4ab",
              borderRadius: 5,
            },
          ],
        }}
        options={options}
      />
    </>
  );
};

export default RevenueByWeekDayChart;
