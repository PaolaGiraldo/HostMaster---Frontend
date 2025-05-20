import { Chart } from "react-chartjs-2";
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
import { useOccupancyReport } from "../../../hooks/Reports/useOccupancyReport";
import { useDateRange } from "../../../context/DateRangeContext";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { range } = useDateRange();
  const { data: occupancy, isLoading } = useOccupancyReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );

  const chartData = {
    labels: occupancy.occupancy_data.map((item) => item.date),
    datasets: [
      {
        type: "bar",
        label: t("reports.bookedRooms"),
        data: occupancy.occupancy_data.map((item) => item.occupied_rooms),
        backgroundColor: "#60c4ab",
        borderRadius: 5,
        yAxisID: "y",
      },

      {
        type: "line",
        label: t("reports.occupancyRate"),
        data: occupancy.occupancy_data.map((item) => item.occupancy_rate),
        backgounrColor: "#1a2a6c",
        borderColor: "#1a2a6c",
        borderWidth: 2,
        fill: false,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    maintainAspectRadio: false,
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        positon: "left",
      },
      y1: {
        type: "linear",
        display: true,
        positon: "right",
        grid: {
          drawnOnChartArea: false,
        },
      },
    },
  };

  return (
    <>
      <div className="chart-container">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </>
  );
};

export default OccupancyChart;
