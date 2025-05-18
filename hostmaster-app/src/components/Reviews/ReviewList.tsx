import React, { useState } from "react";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAllAccommodationReviews } from "../../hooks/useReviews";
import { useAccommodations } from "../../hooks/useAccommodations";
import ReviewCard from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { Review } from "../../interfaces/reviewInterface";
import { createReview } from "../../Services/reviewService";
import { useQueryClient } from "@tanstack/react-query";
import { Trans } from "react-i18next";
import { useClients } from "../../hooks/useCustomers";

type Filter = {
  accommodationId?: number;
  user: string;
  starDate?: string;
  endDate?: string;
  rating?: number;
};

export const ReviewList: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: accommodations = [] } = useAccommodations();
  const accommodationIds = accommodations
    .map((a) => a.id)
    .filter((id): id is number => typeof id === "number");
  const {
    data: allReviews = [],
    isLoading,
    error,
  } = useAllAccommodationReviews(accommodationIds);
  const { data: clients = [] } = useClients();

  const [customerName, setCustomerName] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filter>({
    accommodationId: 0,
    user: "",
    starDate: "",
    endDate: "",
    rating: 0,
  });

  const filteredReviews = allReviews.filter((review) => {
    const matchesAccommodation = filters.accommodationId
      ? review.accommodation_id === filters.accommodationId
      : true;
    const matchesUser = filters.user
      ? review.user_username === customerName
      : true;
    const matchesDate = filters.starDate
      ? review.created_at >= filters.starDate
      : true;
    const matchesEndDate = filters.endDate
      ? review.created_at <= filters.endDate
      : true;
    const matchesRating = filters.rating
      ? review.rating === filters.rating
      : true;
    return (
      matchesAccommodation &&
      matchesUser &&
      matchesDate &&
      matchesEndDate &&
      matchesRating
    );
  });

  const handleClearFilters = () => {
    setFilters({
      accommodationId: 0,
      user: "",
      starDate: "",
      endDate: "",
      rating: 0,
    });
  };

  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSaveReview = async (review: Review) => {
    try {
      // Crear nueva reseña
      await createReview(review);
      queryClient.invalidateQueries({ queryKey: ["allAccommodationReviews"] });
    } catch (error) {
      console.error("Error en handleSaveRoom:", error);
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({
      user: value,
    });

    const foundCustomer = clients?.find((client) =>
      client.full_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(filters.user.toLowerCase())
    );
    setCustomerName(foundCustomer?.username ?? null);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">{t("reviews.title")}</h2>

      <div className="review-call-to-action text-muted">
        <h5>{t("reviews.addTittle")}</h5>
        <p className="alert text-center">
          <Trans i18nKey="reviews.addText" components={[<br />]} />
        </p>
        <Button variant="primary" onClick={() => setShowReviewForm(true)}>
          <i className="bi bi-pencil-square"></i> {t("reviews.addReview")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <div>{t("loading")}</div>
        </div>
      ) : error ? (
        <div className="text-center text-danger">
          {t("accommodations.loadError")}
        </div>
      ) : (
        <div
          style={{
            marginBottom: "5%",
          }}
        >
          <Form className="row g-2 mb-3">
            <Form.Group className="col-md-3">
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("accommodation")}
              </Form.Label>
              <Form.Select
                value={filters.accommodationId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    accommodationId: Number(e.target.value),
                  })
                }
              >
                <option value="">{t("all1")}</option>
                {accommodations.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="col-md-3">
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("customer")}
              </Form.Label>
              <Form.Control
                type="text"
                value={filters.user}
                onChange={handleClientChange}
              />
            </Form.Group>

            <Form.Group className="col-md-3">
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("reviews.fromDate")}
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.starDate}
                onChange={(e) =>
                  setFilters({ ...filters, starDate: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="col-md-3">
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("reviews.toDate")}
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="col-md-3">
              <Form.Label style={{ color: "#FFFFFF" }}>
                {t("reviews.rating")}
              </Form.Label>
              <Form.Select
                value={filters.rating}
                onChange={(e) =>
                  setFilters({ ...filters, rating: Number(e.target.value) })
                }
              >
                <option value="">{t("all1")}</option>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-2 d-flex align-items-end">
              <Button
                variant="secondary"
                onClick={handleClearFilters}
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                title="Limpiar filtros"
              >
                {t("clearFilters")}
              </Button>
            </Form.Group>
          </Form>
        </div>
      )}

      <ReviewForm
        show={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSave={handleSaveReview}
        accommodations={accommodations}
      />

      <Row xs={1} sm={2} md={3} className="g-4">
        {filteredReviews.map((review) => (
          <Col key={review.id}>
            <ReviewCard review={review} key={review.id!} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
