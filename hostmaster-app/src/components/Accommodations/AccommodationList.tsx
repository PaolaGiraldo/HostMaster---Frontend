import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AccommodationCard from "./AccommodationCard";
import AccommodationForm from "./AccommodationForm";
import { useTranslation } from "react-i18next";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { Room } from "../../interfaces/roomInterface";
import {
  createAccommodation,
  deleteAccommodation,
  getAccommodations,
  updateAccommodation,
} from "../../Services/accommodationService";
import { getRoomsByAccommodation } from "../../Services/roomService";
import { getRoomTypeById } from "../../Services/roomTypeService";
import { useLocation } from "../../context/LocationContext";

const AccommodationList: React.FC = () => {
  const { cities } = useLocation();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<any | null>(
    null
  );

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      const accommodationsData = await getAccommodations();

      // Obtener las habitaciones de cada alojamiento
      const accommodationsWithRooms = await Promise.all(
        accommodationsData.map(async (accommodation: Accommodation) => {
          const roomsData = await getRoomsByAccommodation(accommodation.id);
          const cityName = cities.find(
            (city) => city.id === accommodation.city_id
          )?.name;

          // Para cada habitación, obtener su tipo de habitación
          const roomsWithTypes = await Promise.all(
            roomsData.map(async (room: Room) => {
              const typeResponse = await getRoomTypeById(room.type_id);
              return { ...room, roomType: typeResponse };
            })
          );

          return { ...accommodation, cityName, rooms: roomsWithTypes };
        })
      );
      setAccommodations(accommodationsWithRooms);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    }
  };

  const { t } = useTranslation();

  const handleEditAccommodation = (accommodation: any) => {
    setEditingAccommodation(accommodation);
    setShowForm(true);
  };

  const handleSaveAccommodation = async (accommodation: Accommodation) => {
    try {
      if (accommodation.id) {
        await updateAccommodation(accommodation.id, accommodation);
      } else {
        await createAccommodation(accommodation);
      }
      setShowForm(false);
      fetchAccommodations();
      setEditingAccommodation(null);
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
      fetchAccommodations();
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
      <Row>
        {accommodations.length > 0 ? (
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
