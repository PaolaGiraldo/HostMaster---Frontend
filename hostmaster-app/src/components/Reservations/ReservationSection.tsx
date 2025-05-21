import React, { useState, useRef, useMemo, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import ReservationCard from "./ReservationCard";
import { Reservation } from "../../interfaces/reservationInterface";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  icon: string;
  reservations: Reservation[];
  emptyMessage: string;
  onCancel: (res: Reservation) => void;
  onEdit: (res: Reservation) => void;
}

const ReservationSection: React.FC<Props> = ({
  title,
  icon,
  reservations,
  emptyMessage,
  onCancel,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [showSection, setShowSection] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const visibleReservations = useMemo(
    () => reservations.slice(0, visibleCount),
    [reservations, visibleCount]
  );

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (visibleCount < reservations.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setIsLoadingMore(false);
        }, 500); // Simula carga
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleCount, reservations.length, isLoadingMore]);

  return (
    <section className="scroll-custom mb-5">
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          background: "rgba(26, 42, 108, 0.7)",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <h4 className="mb-3" style={{ marginTop: "10px", marginLeft: "20px" }}>
          {icon} {title}
        </h4>
        <button
          className="btn btn-sm btn-light"
          onClick={() => setShowSection((prev) => !prev)}
        >
          {showSection ? "▲" : "▼"}
        </button>
      </div>

      {showSection && (
        <div
          ref={scrollRef}
          style={{
            maxHeight: "630px",
            overflowY: "auto",
            paddingRight: "10px",
            overflowX: "hidden",
            width: "100%",
            borderWidth: "4px",
            borderColor: "rgba(26, 42, 108, 0.1)",
            borderStyle: "solid",
            borderRadius: "0 0 0px 10px",
            background: "rgba(26, 42, 108, 0.7)",
          }}
        >
          <Row xs={1} sm={2} md={2} className="g-4">
            {visibleReservations.length === 0 ? (
              <p>{emptyMessage}</p>
            ) : (
              visibleReservations.map((res) => (
                <Col key={res.id}>
                  <ReservationCard
                    reservation={res}
                    onCancel={onCancel}
                    onEdit={onEdit}
                  />
                </Col>
              ))
            )}
          </Row>

          {isLoadingMore && (
            <div className="text-center my-3">
              <Spinner animation="border" role="status" />
              <div>{t("loading")}</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ReservationSection;
