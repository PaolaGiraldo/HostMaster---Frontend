import React, { useState } from "react";
import { Container, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RoomTable from "./RoomTable";
import RoomForm from "./RoomForm";
import RoomTypeTable from "./RoomTypeTable";
import { updateRoom, createRoom, deleteRoom } from "../../services/roomService";
import {
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../../services/roomTypeService";
import { RoomType } from "../../interfaces/roomTypeInterface";
import { Room } from "../../interfaces/roomInterface";
import { Product } from "../../interfaces/roomProductInterface";
import RoomProductTable from "./RoomProductTable";
import {
  createRoomProduct,
  updateRoomProduct,
  deleteRoomProduct,
} from "../../services/productsService";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useRoomTypes } from "../../hooks/useRoomTypes";
import { useRooms } from "../../hooks/useRooms";
import { useAvailableProducts } from "../../hooks/useAvailableProducts";
import { useQueryClient } from "@tanstack/react-query";
import { uploadRoomImages } from "./UploadImages";

const RoomList: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading: isLoadingRooms } = useRooms();
  const { data: accommodations = [], isLoading: isLoadingAccommodations } =
    useAccommodations();
  const { data: roomTypes = [], isLoading: isLoadingRoomTypes } =
    useRoomTypes();
  const { data: roomProducts = [], isLoading: isLoadingRoomProducts } =
    useAvailableProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [filterAccommodation, setFilterAccommodation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  const filteredRooms = rooms.filter((room) => {
    return (
      (!filterAccommodation ||
        room.accommodation_id.toString() === filterAccommodation) &&
      (!filterType || room.type_id.toString() === filterType) &&
      (!filterAvailability ||
        (filterAvailability === "available"
          ? room.isAvailable
          : !room.isAvailable))
    );
  });

  // Room
  const handleSaveRoom = async (room: Room, images: File[]) => {
    try {
      const savedRoom = room.id
        ? await updateRoom(editingRoom.id!, room)
        : await createRoom(room);

      if (images.length > 0) {
        await uploadRoomImages(savedRoom.id!, images);
      }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      setShowForm(false);
      setEditingRoom(false);
    } catch (error) {
      console.error("Error en handleSaveRoom:", error);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      if (roomId === undefined) {
        console.error("Error: El ID de Room es undefined.");
        return;
      }
      await deleteRoom(roomId); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  // RoomType
  const handleAddRoomType = async (newRoomType: RoomType) => {
    try {
      await createRoomType(newRoomType); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
      setShowForm(false);
      setEditingRoom(false);
    } catch (error) {
      console.error("Error adding room type", error);
    }
  };

  const handleEditRoomType = async (updatedRoomType: RoomType) => {
    try {
      if (updatedRoomType.id === undefined) {
        console.error("Error: El ID de RoomType es undefined.");
        return;
      }
      await updateRoomType(updatedRoomType.id, updatedRoomType);
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
    } catch (error) {
      console.error("Error updating room type", error);
    }
  };

  const handleDeleteRoomType = async (id?: number) => {
    try {
      if (id === undefined) {
        console.error("Error: El ID de RoomType es undefined.");
        return;
      }
      await deleteRoomType(id); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
    } catch (error) {
      console.error("Error deleting room type", error);
    }
  };

  // RoomProduct
  const handleAddRoomProduct = async (newRoomProduct: Product) => {
    try {
      await createRoomProduct(newRoomProduct); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["availableProducts"] });
    } catch (error) {
      console.error("Error adding room type", error);
    }
  };

  const handleEditRoomProduct = async (updatedRoomProduct: Product) => {
    try {
      if (updatedRoomProduct.id === undefined) {
        console.error("Error: El ID de Producto es undefined.");
        return;
      }
      await updateRoomProduct(updatedRoomProduct.id, updatedRoomProduct);
      queryClient.invalidateQueries({ queryKey: ["availableProducts"] });
    } catch (error) {
      console.error("Error updating room product", error);
    }
  };

  const handleDeleteRoomProduct = async (id?: number) => {
    try {
      if (id === undefined) {
        console.error("Error: El ID de Product es undefined.");
        return;
      }
      await deleteRoomProduct(id); // Llamado al backend
      queryClient.invalidateQueries({ queryKey: ["availableProducts"] });
    } catch (error) {
      console.error("Error deleting room product", error);
    }
  };

  if (
    isLoadingRooms ||
    isLoadingAccommodations ||
    isLoadingRoomTypes ||
    isLoadingRoomProducts
  ) {
    return (
      <div className="text-center my-5">
        <h2 className="text-center my-4">{t("rooms.title")}</h2>
        <Spinner animation="border" role="status" />
        <div>{t("loading")}</div>
      </div>
    );
  }

  return (
    <Container>
      <h2 className="text-center my-4">{t("rooms.title")}</h2>
      <Row className="mb-3">
        <Col>
          <Button
            variant="primary"
            className="mb-3"
            onClick={() => {
              setShowForm(true);
              setEditingRoom(null);
            }}
          >
            {t("rooms.addRoom")}
          </Button>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant="secondary"
            onClick={() => {
              setFilterType("");
              setFilterAvailability("");
              setFilterAccommodation("");
            }}
            disabled={
              !filterType && !filterAccommodation && !filterAvailability
            } // Deshabilita el botón si no hay filtro aplicado
          >
            {t("clearFilters")}
          </Button>
        </Col>
      </Row>

      <div className="d-flex gap-3 mb-3">
        <Form.Select
          value={filterAccommodation}
          onChange={(e) => setFilterAccommodation(e.target.value)}
        >
          <option value="">{t("rooms.filterAccommodation")}</option>
          {accommodations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
          }}
        >
          <option value="">{t("rooms.filterType")}</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
        >
          <option value="">{t("rooms.filterAvailability")}</option>
          <option value="available">{t("available")}</option>
          <option value="unavailable">{t("unavailable")}</option>
        </Form.Select>
      </div>

      <RoomTable
        rooms={filteredRooms}
        accommodations={accommodations}
        roomTypes={roomTypes}
        onEdit={(room) => {
          setEditingRoom(room);
          setShowForm(true);
        }}
        onDelete={handleDeleteRoom}
      />
      <div className="mb-5"></div>

      <RoomForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleSaveRoom}
        accommodations={accommodations}
        roomTypes={roomTypes}
        editingRoom={editingRoom}
      />

      <div className="mb-5"></div>

      <h4 className="text-center my-4">{t("rooms.types")}</h4>
      <RoomTypeTable
        roomTypes={roomTypes}
        onAdd={handleAddRoomType}
        onEdit={handleEditRoomType}
        onDelete={handleDeleteRoomType}
      />

      <h4 className="text-center my-4">{t("rooms.products")}</h4>
      <RoomProductTable
        roomProducts={roomProducts}
        onAdd={handleAddRoomProduct}
        onEdit={handleEditRoomProduct}
        onDelete={handleDeleteRoomProduct}
      />
    </Container>
  );
};

export default RoomList;
