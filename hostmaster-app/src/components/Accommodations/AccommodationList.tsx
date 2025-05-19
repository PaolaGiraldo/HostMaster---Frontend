import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AccommodationCard from "./AccommodationCard";
import AccommodationForm from "./AccommodationForm";
import { useTranslation } from "react-i18next";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { Spinner } from "react-bootstrap";
import {
  createAccommodation,
  deleteAccommodation,
  updateAccommodation,
} from "../../Services/accommodationService";
import { useAccommodationsComplete } from "../../hooks/useAccommodationsComplete";
import { uploadAccommodationImages } from "./UploadImages";
import { useQueryClient } from "@tanstack/react-query";

const AccommodationList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<any | null>(
    null
  );

  const {
    data: accommodations,
    isLoading,
    error,
    refetch,
  } = useAccommodationsComplete();

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleEditAccommodation = (accommodation: any) => {
    setEditingAccommodation(accommodation);
    setShowForm(true);
  };

  const handleSaveAccommodation = async (
    accommodation: Accommodation,
    images: File[]
  ) => {
    try {
      const savedAccommodation = accommodation.id
        ? await updateAccommodation(accommodation.id!, accommodation)
        : await createAccommodation(accommodation);

      if (images.length > 0) {
        await uploadAccommodationImages(savedAccommodation.id!, images);
      }
      queryClient.invalidateQueries({ queryKey: ["accommodationsComplete"] });
      setShowForm(false);
      setEditingAccommodation(null);
      refetch();
    } catch (error) {
      console.error("Error saving accommodation:", error);
    }
  };

  const handleDelete = async (id?: number) => {
    if (id === undefined) {
      console.error("Error: El ID de Alojamiento es undefined.");
      return;
    }
    try {
      await deleteAccommodation(id);
      refetch();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <Container className="accommodations-container">
      <h2 className="text-center mb-4">{t("accommodations.title")}</h2>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => {
          setShowForm(true);
          setEditingAccommodation(null);
        }}
      >
        {t("accommodations.addAccommodation")}
      </Button>
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
        <Row>
          {accommodations && accommodations.length > 0 ? (
            accommodations.map((accommodation) => (
              <Col key={accommodation.id} md={6} lg={4} className="mb-4">
                <AccommodationCard
                  accommodation={accommodation}
                  onEdit={handleEditAccommodation}
                  onDelete={handleDelete}
                />
              </Col>
            ))
          ) : (
            <h4 className="text-center">
              {t("accommodations.noAccommodations")}
            </h4>
          )}
        </Row>
      )}
      <AccommodationForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleSaveAccommodation}
        editingAccommodation={editingAccommodation}
      />
    </Container>
  );
};

export default AccommodationList;
