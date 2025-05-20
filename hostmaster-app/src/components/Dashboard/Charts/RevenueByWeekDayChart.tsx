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
  InteractionMode,
} from "chart.js";
import { useDateRange } from "../../../context/DateRangeContext";
import { useRevenueByWeekDayReport } from "../../../hooks/Reports/useRevenueByWeekDayReport";
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

const RevenueByWeekDayChart = ({
  accommodationId,
}: {
  accommodationId: number;
}) => {
  const { t } = useTranslation();
  const { range } = useDateRange();
  const { data, isLoading } = useRevenueByWeekDayReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading || !data) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );
  }

  if (!data.top_revenue_days || data.top_revenue_days.length === 0) {
    return <div>{t("reports.noDataAvailable")}</div>;
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: "index" as InteractionMode, // ✅ Tipado explícito
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        ticks: {
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar
        data={{
          labels: data.top_revenue_days.map(
            (item: { weekday: string }) => item.weekday
          ),
          datasets: [
            {
              type: "bar",
              label: t("reports.revenuebyWeekDay"),
              data: data.top_revenue_days.map(
                (item: { total_revenue: number }) => item.total_revenue
              ),
              backgroundColor: "#60c4ab",
              borderRadius: 5,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default RevenueByWeekDayChart;
