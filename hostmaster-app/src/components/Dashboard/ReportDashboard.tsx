import React, { useState } from "react";
import { Card, Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import OccupancyChart from "./Charts/OccupancyChart";
import { useAccommodations } from "../../hooks/useAccommodations";
import { DateRangeSelector } from "./DateRangeSelector";
import { DateRangeProvider } from "../../context/DateRangeContext";
import RevenueByWeekDayChart from "./Charts/RevenueByWeekDayChart";
import RevenueChart from "./Charts/RevenueChart";
import PerformanceChart from "./Charts/PerformanceChart";
import MaintenanceStackedChart from "./Charts/MaintenanceStackedChart ";
import ReportModal from "./ReportModal";
import ReviewSummary from "./ReviewSummary";
import DailyMatricsChart from "./Charts/DailyMetricChart";

const ReportDashboard: React.FC = ({}) => {
  const { t } = useTranslation();

  const { data: accommodations } = useAccommodations();
  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState<number>(0);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  return (
    <div className="report-dashboard">
      <DateRangeProvider>
        <Container className="py-4">
          <h2 className="text-center my-4">{t("reports.title")}</h2>
          <div className="filters-container d-flex flex-column flex-md-row justify-content-center gap-3 mb-4">
            <div
              className="mb-3"
              style={{
                padding: "50px",
              }}
            >
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
            <Col>
              <Card
                className="mb-4 shadow-sm report-card"
                onClick={() =>
                  openModal(
                    t("reports.occupancy"),
                    <OccupancyChart accommodationId={selectedAccommodationId} />
                  )
                }
              >
                <Card.Body>
                  <Card.Title>{t("reports.occupancy")}</Card.Title>
                  <Card.Text>{t("reports.occupancyDescription")}</Card.Text>
                  <div className="my-4">
                    <OccupancyChart accommodationId={selectedAccommodationId} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className="mb-4 shadow-sm report-card"
                onClick={() =>
                  openModal(
                    t("reports.performance"),
                    <PerformanceChart
                      accommodationId={selectedAccommodationId}
                    />
                  )
                }
              >
                <Card.Body>
                  <Card.Title>{t("reports.performance")}</Card.Title>
                  <Card.Text>{t("reports.performanceDescription")}</Card.Text>
                  <div className="my-4">
                    <PerformanceChart
                      accommodationId={selectedAccommodationId}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row xs={1} sm={2} md={2} className="g-4">
            <Col>
              <Card
                className="mb-4 shadow-sm report-card"
                onClick={() =>
                  openModal(
                    t("reports.revenue"),
                    <RevenueByWeekDayChart
                      accommodationId={selectedAccommodationId}
                    />
                  )
                }
              >
                <Card.Body>
                  <Card.Title>{t("reports.revenue")}</Card.Title>
                  <Card.Text>
                    {t("reports.revenuebyWeekDayDescription")}
                  </Card.Text>
                  <div className="my-4">
                    <RevenueByWeekDayChart
                      accommodationId={selectedAccommodationId}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                className="mb-4 shadow-sm report-card"
                onClick={() =>
                  openModal(
                    t("reports.maintenances"),
                    <MaintenanceStackedChart
                      accommodationId={selectedAccommodationId}
                    />
                  )
                }
              >
                <Card.Body
                  style={{
                    overflowX: "auto",
                  }}
                >
                  <Card.Title> {t("reports.maintenances")}</Card.Title>
                  <Card.Text>{t("reports.maintenancesDescription")}</Card.Text>
                  <div className="my-4">
                    <MaintenanceStackedChart
                      accommodationId={selectedAccommodationId}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row xs={1} sm={2} md={2} className="g-4">
            <Col>
              <Card
                className="mb-4 shadow-sm report-card"
                onClick={() =>
                  openModal(
                    t("reports.revenue"),
                    <RevenueChart accommodationId={selectedAccommodationId} />
                  )
                }
              >
                <Card.Body>
                  <Card.Title>{t("reports.revenue")}</Card.Title>

                  <Card.Text>{t("reports.revenueDescription")}</Card.Text>
                  <div className="my-4">
                    <RevenueChart accommodationId={selectedAccommodationId} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card
                style={{
                  height: "750px",
                }}
                className="mb-4 shadow-sm report-card"
                onClick={() =>
                  openModal(
                    t("reports.revenue"),
                    <ReviewSummary accommodationId={selectedAccommodationId} />
                  )
                }
              >
                <Card.Body
                  style={{
                    overflowX: "auto",
                  }}
                >
                  <Card.Title> {t("reports.summary")}</Card.Title>
                  <Card.Text>{t("reports.summaryDescription")}</Card.Text>
                  <div className="my-4">
                    <ReviewSummary accommodationId={selectedAccommodationId} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card
                style={{
                  height: "500px",
                  overflowX: "auto",
                }}
                className="mb-4 shadow-sm report-card"
                onClick={() =>
                  openModal(
                    t("reports.daily"),
                    <DailyMatricsChart
                      accommodationId={selectedAccommodationId}
                    />
                  )
                }
              >
                <Card.Body>
                  <Card.Title>{t("reports.daily")}</Card.Title>

                  <Card.Text>{t("reports.dailyDescription")}</Card.Text>
                  <div className="my-4">
                    <DailyMatricsChart
                      accommodationId={selectedAccommodationId}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </DateRangeProvider>

      <ReportModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={modalTitle}
      >
        {modalContent}
      </ReportModal>
    </div>
  );
};
export default ReportDashboard;
