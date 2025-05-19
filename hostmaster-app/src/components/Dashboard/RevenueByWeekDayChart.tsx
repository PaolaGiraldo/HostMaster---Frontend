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
import { useDateRange } from "../../context/DateRangeContext";
import { useRevenueByWeekDayReport } from "../../hooks/useRevenueByWeekDayReport";

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
  const { data: revenue, isLoading } = useRevenueByWeekDayReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading) return <p className="text-muted">Cargando reservas...</p>;
  if (!revenue)
    return <p className="text-danger">No se pudo cargar el reporte.</p>;
  console.log(revenue);
  return <></>;
};

export default RevenueByWeekDayChart;
