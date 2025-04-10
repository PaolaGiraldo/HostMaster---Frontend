import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RoomTable from "./RoomTable";
import RoomForm from "./RoomForm";
import RoomTypeTable from "./RoomTypeTable";
import { getAccommodations } from "../../Services/accommodationService";
import { getRooms, updateRoom, createRoom } from "../../Services/roomService";
import { getRoomTypes } from "../../Services/roomTypeService";
import { createRoomType } from "../../Services/roomTypeService";
import { updateRoomType } from "../../Services/roomTypeService";
import { deleteRoomType } from "../../Services/roomTypeService";
import { RoomType } from "../../interfaces/roomTypeInterface";
import { Room } from "../../interfaces/roomInterface";

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [filterAccommodation, setFilterAccommodation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchAccommodations();
    fetchRoomTypes();
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

  //TODO
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

  const handleDelete = (roomId: number) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
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
    </Container>
  );
};

export default RoomList;
