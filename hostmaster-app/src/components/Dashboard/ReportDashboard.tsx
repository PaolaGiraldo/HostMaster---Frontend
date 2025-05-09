import React, { useState } from "react";
import { Card, Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import OccupancyChart from "./OccupancyChart";
import AvailabilityHeatmap from "./AvailabilityHeatmap";
import InventoryPieChart from "./InventoryPieChart";
import RevenueLineChart from "./RevenueLineChart";
import ReviewSummary from "./ReviewSummary";
import { useAccommodations } from "../../hooks/useAccommodations";
import { DateRangeSelector } from "./DateRangeSelector";
import { DateRangeProvider } from "../../context/DateRangeContext";

const ReportDashboard: React.FC = ({}) => {
  const { t } = useTranslation();

  const { data: accommodations } = useAccommodations();
  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState<number>(0);

  return (
    // ReportDashboard.tsx
    <DateRangeProvider>
      <Container fluid className="mt-4">
        <h2 className="mb-4 text-center">{t("reports.title")}</h2>

        <Form.Select
          value={selectedAccommodationId}
          onChange={(e) => setSelectedAccommodationId(Number(e.target.value))}
        >
          <option value="">Todos los alojamientos</option>
          {accommodations?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Form.Select>

        <DateRangeSelector></DateRangeSelector>

        <Row className="gy-4">
          {/* Ocupación */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white">
                {t("reports.occupancy")}
              </Card.Header>
              <Card.Body>
                {/* Chart de ocupación (e.g. Chart.js) */}
                <OccupancyChart accommodationId={selectedAccommodationId} />
              </Card.Body>
            </Card>
          </Col>

          {/* Disponibilidad */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white">
                {t("reports.availability")}
              </Card.Header>
              <Card.Body>
                {/* Gráfico de calor o calendario */}
                <AvailabilityHeatmap />
              </Card.Body>
            </Card>
          </Col>

          {/* Inventario */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white">
                {t("reports.inventory")}
              </Card.Header>
              <Card.Body>
                <InventoryPieChart />
              </Card.Body>
            </Card>
          </Col>

          {/* Ingresos */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white">
                {t("reports.revenue")}
              </Card.Header>
              <Card.Body>
                <RevenueLineChart />
              </Card.Body>
            </Card>
          </Col>

          {/* Reseñas */}
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white">
                {t("reports.reviews")}
              </Card.Header>
              <Card.Body>
                <ReviewSummary />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DateRangeProvider>
  );
};
export default ReportDashboard;
