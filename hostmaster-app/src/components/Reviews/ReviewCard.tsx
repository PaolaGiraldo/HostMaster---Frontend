import React from "react";
import { Review } from "../../interfaces/reviewInterface";
import { Card } from "react-bootstrap";
import { format } from "date-fns";
import { useClients } from "../../hooks/useCustomers";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { data: clients = [] } = useClients();

  return (
    <>
      <Card className="h-100 mb-3 shadow-sm review-card" key={review.id}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-person-circle fs-5 text-secondary" />
              <strong>
                {
                  clients.find((c) => c.username == review.user_username)
                    ?.full_name
                }
              </strong>
            </div>
            <small className="text-muted">
              {format(new Date(review.created_at), "dd MMM yyyy")}
            </small>
          </div>

          <div className="mb-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi ${
                  i < review.rating
                    ? "bi-star-fill text-warning"
                    : "bi-star text-muted"
                }`}
              />
            ))}
          </div>

          <Card.Text>{review.comment}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default ReviewCard;
