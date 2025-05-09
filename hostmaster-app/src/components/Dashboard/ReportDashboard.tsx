import React, { useState } from "react";
import { Card, Container, Row, Col, Form, Accordion } from "react-bootstrap";
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
                  <Accordion.Header>
                    {t("reports.availability")}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">
                      {t("reports.availabilityDescription")}
                    </p>
                    <div className="my-4">
                      <AvailabilityHeatmap
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>{t("reports.inventory")}</Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">{t("reports.inventoryDescription")}</p>

                    <div className="my-4">
                      <InventoryPieChart
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>{t("reports.revenue")}</Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">{t("reports.revenueDescription")}</p>
                    <div className="my-4">
                      <RevenueLineChart
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>{t("reports.reviews")}</Accordion.Header>
                  <Accordion.Body>
                    <p className="mb-4">{t("reports.reviewsDescription")}</p>
                    <div className="my-4">
                      <ReviewSummary
                        accommodationId={selectedAccommodationId}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                  <Accordion.Header>xxxx</Accordion.Header>
                  <Accordion.Body>
                    {/* Aquí va tu componente de inventario */}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                  <Accordion.Header>xxxx</Accordion.Header>
                  <Accordion.Body>
                    {/* Aquí va tu componente de inventario */}
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
