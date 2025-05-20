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
  ChartOptions,
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

  if (isLoading || !performance) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );
  }

  if (!performance || performance.room_bookings.length === 0) {
    return (
      <div style={{ background: "#ffffff ", color: "#1a2a6c" }}>
        <strong>{t("reports.noDataAvailable")}</strong>
      </div>
    );
  }

  const options: ChartOptions<"bar"> = {
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
        beginAtZero: true,
        position: "left",
        ticks: {
          padding: 10,
        },
        stacked: false,
        grace: "10%",
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
            labels: performance.room_bookings.map(
              (item: { room_number: number }) => item.room_number
            ),
            datasets: [
              {
                label: t("reservations.title"),
                data: performance.room_bookings.map(
                  (item: { bookings: number }) => item.bookings
                ),
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
