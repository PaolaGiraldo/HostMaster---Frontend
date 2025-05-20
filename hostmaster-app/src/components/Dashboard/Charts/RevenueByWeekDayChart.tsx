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
        display: true,
        positon: "left",
      },
    },
  };

  return (
    <>
      <div className="chart-container">
        <Bar
          data={{
            labels: data.top_revenue_days.map((item) => item.weekday),
            datasets: [
              {
                type: "bar",
                label: t("reports.revenuebyWeekDay"),
                data: data.top_revenue_days.map((item) => item.total_revenue),
                backgroundColor: "#60c4ab",
                borderRadius: 5,
              },
            ],
          }}
          options={options}
        />
      </div>
    </>
  );
};

export default RevenueByWeekDayChart;
