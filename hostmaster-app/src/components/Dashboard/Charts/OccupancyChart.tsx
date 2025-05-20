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
import { Chart as ReactChart } from "react-chartjs-2";
import { useOccupancyReport } from "../../../hooks/Reports/useOccupancyReport";
import { useDateRange } from "../../../context/DateRangeContext";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import type { ChartData, ChartOptions } from "chart.js";

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

  if (isLoading || !occupancy)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );

  if (
    occupancy.accommodation_id === 0 ||
    occupancy.occupancy_data.length === 0
  ) {
    return (
      <div style={{ background: "#ffffff ", color: "#1a2a6c" }}>
        <strong>{t("reports.noDataAvailable")}</strong>
      </div>
    );
  }

  const chartData: ChartData<"bar" | "line", number[], string> = {
    labels: occupancy.occupancy_data?.map((item) => item.date),
    datasets: [
      {
        type: "bar" as const,
        label: t("reports.bookedRooms"),
        data: occupancy.occupancy_data.map((item) => item.occupied_rooms),
        backgroundColor: "rgba(96, 196, 171, 0.5)",
        borderRadius: 5,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: t("reports.occupancyRate"),
        data: occupancy.occupancy_data.map((item) => item.occupancy_rate),
        backgroundColor: "#1a2a6c",
        borderColor: "#1a2a6c",
        borderWidth: 2,
        fill: false,
        yAxisID: "y1",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
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
      y: {
        type: "linear",
        display: true,
        position: "left",
        stacked: false,
        grace: "10%",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        stacked: false,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <>
      <div className="chart-container">
        <ReactChart
          type={"bar" as "bar" | "line"}
          data={chartData}
          options={options}
        />
      </div>
    </>
  );
};

export default OccupancyChart;
