import React, { useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Accordion,
  CardTitle,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import OccupancyChart from "./Charts/OccupancyChart";
import InventoryPieChart from "./InventoryPieChart";
import ReviewSummary from "./ReviewSummary";
import { useAccommodations } from "../../hooks/useAccommodations";
import { DateRangeSelector } from "./DateRangeSelector";
import { DateRangeProvider } from "../../context/DateRangeContext";
import RevenueByWeekDayChart from "./Charts/RevenueByWeekDayChart";
import RevenueChart from "./Charts/RevenueChart";
import PerformanceChart from "./Charts/PerformanceChart";
import PendingMaintenanceChart from "./Charts/PendingMaintenanceChart";
import MaintenanceStackedChart from "./Charts/MaintenanceStackedChart ";

const ReportDashboard: React.FC = ({}) => {
  const { t } = useTranslation();

  const { data: accommodations } = useAccommodations();
  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState<number>(0);

  return (
    <div className="report-dashboard">
      <DateRangeProvider>
        <Container className="py-4">
          <h2 className="text-center my-4">{t("reports.title")}</h2>
          <div className="filters-container d-flex flex-column flex-md-row justify-content-center gap-3 mb-4">
            <div className="mb-3">
              <Form.Label className="fw-bold">
                Seleccionar un alojamiento
              </Form.Label>
              {accommodations?.map((accommodation) => (
                <Form.Check
                  key={accommodation.id}
                  type="radio"
                  name="accommodation"
                  id={`accommodation-${accommodation.id}`}
                  label={accommodation.name}
                  value={accommodation.id}
                  checked={selectedAccommodationId === accommodation.id}
                  onChange={() => setSelectedAccommodationId(accommodation.id!)}
                  className="mb-2"
                />
              ))}
            </div>
            <div className="range-selector">
              <DateRangeSelector></DateRangeSelector>
            </div>
          </div>

          <Row xs={1} sm={2} md={2} className="g-4">
            <Card
              className="mb-3 shadow-sm"
              style={{
                //backgroundColor: STATUS_COLORS[reservation.status] || "#3a3a3a",
                //color: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Card.Body>
                <Card.Title>{t("reports.occupancy")}</Card.Title>

                <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                <Card.Text>
                  {t("reports.occupancyDescription")}
                  <br />
                  <div className="my-4">
                    <OccupancyChart accommodationId={selectedAccommodationId} />
                  </div>{" "}
                </Card.Text>
              </Card.Body>
            </Card>
            <Col>
              <Card
                className="mb-3 shadow-sm"
                style={{
                  //backgroundColor: STATUS_COLORS[reservation.status] || "#3a3a3a",
                  //color: "white",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <Card.Body>
                  <Card.Title>{t("reports.revenue")}</Card.Title>

                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text>
                    {t("reports.revenueDescription")}
                    <br />
                    <div className="my-4">
                      <RevenueChart accommodationId={selectedAccommodationId} />
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <p className="mb-4">{t("reports.revenueDescription")}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <p className="mb-4">{t("reports.revenueDescription")}</p>
                  <div className="my-4">
                    <RevenueChart accommodationId={selectedAccommodationId} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <p className="mb-4">{t("reports.revenueDescription")}</p>
                  <div className="my-4">
                    <RevenueChart accommodationId={selectedAccommodationId} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow report-card">
            <Card.Body>
              <Accordion defaultActiveKey="0" className="my-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{t("reports.occupancy")}</Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">{t("reports.occupancyDescription")}</p>
                    <div className="my-4">
                      <OccupancyChart
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>{t("reports.revenue")}</Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">{t("reports.revenueDescription")}</p>
                    <div className="my-4">
                      <RevenueChart accommodationId={selectedAccommodationId} />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    {t("reports.performance")}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">
                      {t("reports.performanceDescription")}
                    </p>

                    <div className="my-4">
                      <PerformanceChart
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    {t("reports.revenuebyWeekDay")}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">
                      {t("reports.revenuebyWeekDayDescription")}
                    </p>
                    <div className="my-4">
                      <RevenueByWeekDayChart
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    {t("reports.maintenances")}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">
                      {t("reports.maintenancesDescription")}
                    </p>
                    <div className="my-4">
                      <MaintenanceStackedChart
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Agregar más secciones según los reportes */}
              </Accordion>
            </Card.Body>
          </Card>
        </Container>
      </DateRangeProvider>
    </div>
  );
};
export default ReportDashboard;
