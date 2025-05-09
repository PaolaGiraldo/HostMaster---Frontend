import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useOccupancyReport } from "../../hooks/useOccupancyReport";
import { useDateRange } from "../../context/DateRangeContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const OccupancyChart = ({ accommodationId }: { accommodationId: number }) => {
  const { range } = useDateRange();
  const { data, isLoading } = useOccupancyReport(
    range.startDate,
    range.endDate,
    accommodationId
  );

  if (isLoading) return <p className="text-muted">Cargando reservas...</p>;
  if (!data)
    return <p className="text-danger">No se pudo cargar el reporte.</p>;

  return (
    <>
      <Bar
        data={{
          labels: data?.labels,
          datasets: [
            {
              label: "Ocupación",
              data: data?.data,
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

export default OccupancyChart;
