import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import { useDateRange } from "../../../context/DateRangeContext";
import { OverlayTrigger, Tooltip, Spinner, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import type { ChartData, ChartOptions } from "chart.js";
import { useDailyMetricsReport } from "../../../hooks/Reports/useDailyMetricsReport";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const DailyMatricsChart = ({
  accommodationId,
}: {
  accommodationId: number;
}) => {
  const { t } = useTranslation();
  const { range } = useDateRange();
  const { data, isLoading } = useDailyMetricsReport(
    accommodationId,
    range.startDate,
    range.endDate
  );

  if (isLoading || !data)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );

  if (data.accommodation_id === 0) {
    return (
      <div style={{ background: "#ffffff ", color: "#1a2a6c" }}>
        <strong>{t("reports.noDataAvailable")}</strong>
      </div>
    );
  }

  const chartData: ChartData<"bar" | "line", number[], string> = {
    labels: data.daily_metrics.map((d: { date: string }) => d.date),
    datasets: [
      {
        type: "bar",
        label: t("reports.reservations"),
        data: data.daily_metrics.map(
          (d: { reservations: number }) => d.reservations
        ),
        backgroundColor: "rgba(96, 196, 171, 0.5)",
        yAxisID: "y",
        borderRadius: 5,
      },
      {
        type: "line",
        label: t("reports.revenue"),
        data: data.daily_metrics.map((d: { revenue: number }) => d.revenue),
        borderColor: "#1a2a6c",
        backgroundColor: "#1a2a6c",
        yAxisID: "y1",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      },
      {
        type: "line",
        label: t("reports.occupancyRate"),
        data: data.daily_metrics.map(
          (d: { occupancy_rate: number }) => d.occupancy_rate
        ),
        borderColor: "#ffc107",
        backgroundColor: "#ffc107",
        yAxisID: "y2",
        borderWidth: 2,
        fill: false,
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
      y1: {
        type: "linear",
        display: true,
        position: "left",
        grace: "10%",
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: { callback: (v) => `${v}%` },
        grace: "10%",
      },

      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          drawOnChartArea: false,
        },

        grace: "10%",
      },
    },
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "PENDING":
        return "bg-warning text-dark";
      case "IN_PROGRESS":
        return "bg-info text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          gap: "1rem",
          background: "#ffffff",
        }}
      >
        <div className="chart-container">
          <ReactChart
            type={"bar" as "bar" | "line" | "line"}
            data={chartData}
            options={options}
          />
        </div>
        <h6></h6>
        <div>
          <Table striped bordered responsive style={{ fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("reports.revenue")}</th>
                <th>{t("reports.occupiedRooms")}</th>
                <th>{t("reports.occupancyRate")}</th>
                <th>{t("reports.reservations")}</th>
                <th>{t("reports.maintenanceIssues")}</th>
              </tr>
            </thead>
            <tbody>
              {data.daily_metrics.map((d: any) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{d.revenue}</td>
                  <td>{d.occupied_rooms}</td>
                  <td>{d.occupancy_rate.toFixed(2)}%</td>
                  <td>{d.reservations}</td>
                  <td>
                    {d.maintenance_issues.length > 0
                      ? d.maintenance_issues.map((issue: any, index: any) => {
                          const text = issue.split(" (")[0]; // Extrae el texto antes del paréntesis
                          const statusMatch = issue.match(
                            /\((MaintenanceStatus\.(\w+))\)/
                          );
                          const status = statusMatch
                            ? statusMatch[2]
                            : "UNKNOWN";
                          const badgeClass = getStatusColor(status);

                          return (
                            <div key={`${d.date}-${index}`}>
                              <OverlayTrigger
                                key={index}
                                placement="top"
                                overlay={(props) => (
                                  <Tooltip id={`tooltip-${index}`} {...props}>
                                    {text}
                                  </Tooltip>
                                )}
                              >
                                <span
                                  key={index}
                                  className={`badge ${badgeClass} me-1`}
                                  style={{ cursor: "pointer" }}
                                >
                                  {issue.toString().slice(0, 8)}
                                </span>
                              </OverlayTrigger>
                            </div>
                          );
                        })
                      : t("reports.noIncidents")}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default DailyMatricsChart;
