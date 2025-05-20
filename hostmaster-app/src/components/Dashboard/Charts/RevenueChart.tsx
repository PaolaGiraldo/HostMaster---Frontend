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
} from "chart.js";
import { useDateRange } from "../../../context/DateRangeContext";
import { useRevenueReport } from "../../../hooks/Reports/useRevenueReport";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { range } = useDateRange();
  const { data: revenueTotal, isLoading } = useRevenueReport(
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

  if (revenueTotal.accommodation_id === 0) {
    return (
      <div style={{ background: "#ffffff ", color: "#1a2a6c" }}>
        <strong>{t("reports.noDataAvailable")}</strong>
      </div>
    );
  }
  const chartData = {
    labels: [t("reports.estimatedRevenue")],
    datasets: [
      {
        data: [revenueTotal.estimated_revenue],
        backgroundColor: "#1a2a6c",
      },
    ],
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
        height: "300px",
        background: " #ffffff",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "300px",
          height: "90%",
        }}
      >
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "#3a3a3a", // texto blanco
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default RevenueChart;
