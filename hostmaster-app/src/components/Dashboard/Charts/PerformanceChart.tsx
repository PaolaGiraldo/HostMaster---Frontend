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
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";

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
  const { t } = useTranslation();
  const { range } = useDateRange();
  const { data: performance, isLoading } = usePerformanceReport(
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
  const options = {
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
        beginAtZero: true,
        display: true,
        positon: "left",
        margin: 20,
      },
    },
  };

  return (
    <>
      <strong>{t("reports.totalBookings")}: </strong>
      {performance.total_reservations}
      <br />
      <strong>{t("reports.cancelRate")}: </strong>
      {performance.cancellation_rate}
      <div className="chart-container">
        <Bar
          data={{
            labels: performance.room_bookings.map((item) => item.room_number),
            datasets: [
              {
                label: t("reservations.title"),
                data: performance.room_bookings.map((item) => item.bookings),
                backgroundColor: "#60c4ab",
                borderRadius: 5,
                yAxisID: "y",
              },
            ],
          }}
          options={options}
        />
      </div>
    </>
  );
};

export default PerformanceChart;
