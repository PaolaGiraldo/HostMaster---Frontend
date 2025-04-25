import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RoomTable from "./RoomTable";
import RoomForm from "./RoomForm";
import RoomTypeTable from "./RoomTypeTable";
import { getAccommodations } from "../../Services/accommodationService";
import {
  getRooms,
  updateRoom,
  createRoom,
  deleteRoom,
} from "../../Services/roomService";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../../Services/roomTypeService";
import { RoomType } from "../../interfaces/roomTypeInterface";
import { Room } from "../../interfaces/roomInterface";
import { Product } from "../../interfaces/roomProductInterface";
import RoomProductTable from "./RoomProductTable";
import {
  getProducts,
  createRoomProduct,
  updateRoomProduct,
  deleteRoomProduct,
} from "../../Services/productsService";

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [roomProducts, setRoomProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [filterAccommodation, setFilterAccommodation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchAccommodations();
    fetchRoomTypes();
    fetchProducts();
  }, []);

  const { t } = useTranslation();

  const fetchRooms = async () => {
    const response = await getRooms();
    setRooms(response);
    console.log(response);
  };

  const fetchAccommodations = async () => {
    const response = await getAccommodations();
    setAccommodations(response);
  };

  const fetchRoomTypes = async () => {
    const response = await getRoomTypes();
    setRoomTypes(response);
  };

  const fetchProducts = async () => {
    const response = await getProducts();
    setRoomProducts(response);
  };

  const handleSaveRoom = async (room: Room) => {
    try {
      if (room.id) {
        // Actualizar habitación existente
        console.log(room);
        await updateRoom(room.id, room);
      } else {
        // Crear nueva habitación
        await createRoom(room);
      }

      // Recargar la lista de habitaciones después de la actualización/creación
      fetchRooms();
      setShowForm(false);
      setEditingRoom(false);
    } catch (error) {
      console.error("Error en handleSaveRoom:", error);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

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

  const handleDelete = async (roomId: number) => {
    try {
      if (roomId === undefined) {
        console.error("Error: El ID de Room es undefined.");
        return;
      }
      await deleteRoom(roomId); // Llamado al backend
      setRooms(rooms.filter((rt) => rt.id !== roomId));
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  const handleAddRoomType = async (newRoomType: RoomType) => {
    try {
      const createdRoomType = await createRoomType(newRoomType); // Llamado al backend
      setRoomTypes([...roomTypes, createdRoomType]); // Actualiza el estado con la respuesta del backend
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
      setRoomTypes(
        roomTypes.map((rt) =>
          rt.id === updatedRoomType.id ? updatedRoomType : rt
        )
      );
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
      setRoomTypes(roomTypes.filter((rt) => rt.id !== id));
    } catch (error) {
      console.error("Error deleting room type", error);
    }
  };

  const handleAddRoomProduct = async (newRoomProduct: Product) => {
    try {
      const createdRoomType = await createRoomProduct(newRoomProduct); // Llamado al backend
      setRoomProducts([...roomProducts, createdRoomType]); // Actualiza el estado con la respuesta del backend
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
      setRoomProducts(
        roomProducts.map((rp) =>
          rp.id === updatedRoomProduct.id ? updatedRoomProduct : rp
        )
      );
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
      setRoomProducts(roomProducts.filter((rt) => rt.id !== id));
    } catch (error) {
      console.error("Error deleting room product", error);
    }
  };

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
        onEdit={handleEditRoom}
        onDelete={handleDelete}
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
