import CalendarHeatmap from "react-calendar-heatmap";
import { parseISO, format, subDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { useDateRange } from "../../../context/DateRangeContext";
import { useDailyMetricsReport } from "../../../hooks/Reports/useDailyMetricsReport";
import { Spinner } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import { es } from "date-fns/locale";

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
    (metric: { date: string; occupied_rooms: any }) => {
      const fecha = parseISO(metric.date);
      const mesAbreviado = format(fecha, "MMM", { locale: es });
      const mesCapitalizado =
        mesAbreviado.charAt(0).toUpperCase() + mesAbreviado.slice(1);
      const fechaFormateada = `${mesCapitalizado}-01-${format(fecha, "yyyy")}`;

      return {
        date: metric.date,
        count: metric.occupied_rooms,
        tooltip: `${fechaFormateada}: ${metric.occupied_rooms} ${t(
          "reports.occupiedRooms"
        )}`,
      };
    }
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
        tooltipDataAttrs={(value) =>
          ({
            "data-tooltip-content": (value as HeatmapValue)?.tooltip ?? "",
            "data-tooltip-id": "heatmap-tooltip",
          } as unknown as React.HTMLAttributes<SVGElement>)
        }
        showWeekdayLabels
      />

      <Tooltip
        id="heatmap-tooltip"
        place="top"
        style={{ background: "#1a2a6c" }}
      />
    </div>
  );
};

export default OccupancyHeatmap;
