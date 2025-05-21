import CalendarHeatmap from "react-calendar-heatmap";
import { parseISO, format, subDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { useDateRange } from "../../../context/DateRangeContext";
import { useDailyMetricsReport } from "../../../hooks/Reports/useDailyMetricsReport";
import { Spinner } from "react-bootstrap";

interface HeatmapValue {
  date: string;
  count: number;
  tooltip: string;
}

const OccupancyHeatmap = ({ accommodationId }: { accommodationId: number }) => {
  const { t } = useTranslation();

  const { range } = useDateRange();

  const endDate = range.endDate;
  const startDate = subDays(endDate, 180);

  const { data, isLoading } = useDailyMetricsReport(
    accommodationId,
    startDate,
    endDate
  );

  const heatmapValues: HeatmapValue[] = data?.daily_metrics.map(
    (metric: { date: string; occupied_rooms: any }) => ({
      date: metric.date,
      count: metric.occupied_rooms,
      tooltip: `${format(parseISO(metric.date), "yyyy-MM-dd")}: ${
        metric.occupied_rooms
      } ${t("reports.occupiedRooms")}`,
    })
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

  return (
    <div
      className="chart-container"
      style={{
        height: "auto",
        paddingRight: "50px",
      }}
    >
      <h4>{t("reports.occupancyHeatmap")}</h4>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapValues}
        classForValue={(value) => {
          if (!value || typeof value.count !== "number") {
            return "color-empty";
          }
          if (value.count < data.total_rooms * 0.3) {
            return "color-scale-1";
          }
          if (value.count < data.total_rooms * 0.6) {
            return "color-scale-2";
          }
          if (value.count < data.total_rooms * 0.9) {
            return "color-scale-3";
          }
          return "color-scale-4";
        }}
        showWeekdayLabels
      />
    </div>
  );
};

export default OccupancyHeatmap;
