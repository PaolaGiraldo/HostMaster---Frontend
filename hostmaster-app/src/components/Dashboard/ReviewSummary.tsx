import { useDateRange } from "../../context/DateRangeContext";
import { Col, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSummaryReport } from "../../hooks/Reports/useSummaryReport";
import {
  FaBed,
  FaMoneyBillWave,
  FaConciergeBell,
  FaChartLine,
  FaTools,
} from "react-icons/fa";

const ReviewSummary = ({ accommodationId }: { accommodationId: number }) => {
  const { t } = useTranslation();
  const { range } = useDateRange();
  const { data, isLoading } = useSummaryReport(
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

  return (
    <div className="chart-container">
      {/* Ocupación */}
      <h6 className="mb-3">
        <FaBed className="me-2" />
        {t("reports.occupancy")}
      </h6>
      <Row>
        <Col md={4}>
          <strong>{t("reports.occupancyRate")}:</strong>{" "}
          {data.summary.occupancy_rate.toFixed(2)}%
        </Col>
        <Col md={4}>
          <strong>{t("reports.avgOccupiedRooms")}:</strong>{" "}
          {data.summary.avg_occupied_rooms.toFixed(2)}
        </Col>
        <Col md={4}>
          <strong>{t("reports.byRoomType")}</strong>
          <ul className="mb-0 ps-3">
            <li>
              {t("roomTypes.sencilla")}:{" "}
              {data.summary.avg_occupied_sencilla.toFixed(2)}%
            </li>
            <li>
              {t("roomTypes.doble")}:{" "}
              {data.summary.avg_occupied_doble.toFixed(2)}%
            </li>
            <li>
              {t("roomTypes.familiar")}:{" "}
              {data.summary.avg_occupied_familiar.toFixed(2)}%
            </li>
          </ul>
        </Col>
      </Row>

      <hr />

      {/* Ingresos */}
      <h6 className="mb-3">
        <FaMoneyBillWave className="me-2" />
        {t("reports.revenue")}
      </h6>
      <Row>
        <Col md={4}>
          <strong>{t("reports.totalRevenue")}:</strong> $
          {data.summary.total_revenue.toLocaleString()}
        </Col>
        <Col md={4}>
          <strong>{t("reports.dailyRevenue")}:</strong> $
          {data.summary.avg_daily_revenue.toLocaleString()}
        </Col>
        <Col md={4}>
          <strong>{t("reports.revenueByRoomType")}</strong>
          <ul className="mb-0 ps-3">
            <li>
              {t("roomTypes.sencilla")}: $
              {data.summary.avg_revenue_sencilla.toLocaleString()}
            </li>
            <li>
              {t("roomTypes.doble")}: $
              {data.summary.avg_revenue_doble.toLocaleString()}
            </li>
            <li>
              {t("roomTypes.familiar")}: $
              {data.summary.avg_revenue_familiar.toLocaleString()}
            </li>
          </ul>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={4}>
          <strong>
            <FaConciergeBell className="me-1" />
            {t("reports.extraServicesPerRoom")}:
          </strong>{" "}
          {data.summary.avg_extra_services_per_room}
        </Col>
        <Col md={4}>
          <strong>{t("reports.extraServiceRevenue")}:</strong> $
          {data.summary.extra_service_revenue.toLocaleString()}
        </Col>
      </Row>

      <hr />

      {/* Reservas y mantenimiento */}
      <h6 className="mb-3">
        <FaChartLine className="me-2" />
        {t("reports.reservationsAndMaintenance")}
      </h6>
      <Row>
        <Col md={4}>
          <strong>{t("reports.confirmedReservations")}:</strong>{" "}
          {data.summary.confirmed_reservations}
        </Col>
        <Col md={4}>
          <strong>{t("reports.cancelledReservations")}:</strong>{" "}
          {data.summary.cancelled_reservations}
        </Col>
        <Col md={4}>
          <strong>
            <FaTools className="me-1" />
            {t("reports.maintenanceIncidents")}:
          </strong>{" "}
          {data.summary.maintenance_incidents}
        </Col>
      </Row>
    </div>
  );
};
export default ReviewSummary;
