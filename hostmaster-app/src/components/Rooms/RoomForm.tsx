import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RoomType } from "../../interfaces/roomTypeInterface";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { Room } from "../../interfaces/roomInterface";
import { uploadRoomImages } from "./UploadImages";
import { createRoom, updateRoom } from "../../Services/roomService";

interface RoomFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (room: Room) => void;
  accommodations: Accommodation[];
  roomTypes: RoomType[];
  editingRoom?: Room;
}

const RoomForm: React.FC<RoomFormProps> = ({
  show,
  onHide,
  onSave,
  accommodations,
  roomTypes,
  editingRoom,
}) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const { t } = useTranslation();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editingRoom) {
      reset({
        number: editingRoom.number,
        accommodation_id: editingRoom.accommodation_id,
        type_id: editingRoom.type_id,
        isAvailable: editingRoom.isAvailable,
        price: editingRoom.price,
      });
    }

    // Cargar URLs de imágenes existentes
    if (editingRoom?.images && editingRoom.images.length > 0) {
      const existingPreviews = editingRoom.images.map((img) => img.url);
      setImagePreviews(existingPreviews);
    } // Limpiar imágenes nuevas

    setImages([]);
  }, [editingRoom, reset]);

  useEffect(() => {
    if (!show) {
      reset({
        number: "",
        accommodation_id: 0,
        type_id: 0,
        isAvailable: true,
        price: 0,
      });
      setImagePreviews([]);
    }
  }, [show, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]); // acumula imágenes nuevas

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]); // acumula vistas previas
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const onSubmit = async (data: any) => {
    const roomData: Room = {
      number: data.number,
      accommodation_id: data.accommodation_id,
      type_id: data.type_id,
      isAvailable: data.isAvailable,
      price: data.price,
      id: editingRoom?.id,
    };

    try {
      const savedRoom = editingRoom
        ? await updateRoom(editingRoom.id!, roomData)
        : await createRoom(roomData);

      if (images.length > 0) {
        await uploadRoomImages(savedRoom.id!, images);
      }

      onSave(savedRoom);
      handleClose();
    } catch (error) {
      console.error("Error al guardar o actualizar la habitación:", error);
    }
  };

  const handleClose = () => {
    setImagePreviews([]);
    reset();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingRoom ? t("rooms.editRoom") : t("rooms.newRoom")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>{t("rooms.roomNumber")}</Form.Label>
            <Controller
              control={control}
              name="number"
              render={({ field }) => (
                <Form.Control type="text" {...field} required />
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("accommodation")}</Form.Label>
            <Controller
              control={control}
              name="accommodation_id"
              render={({ field }) => (
                <Form.Select {...field} required>
                  <option value="">{t("select")}</option>
                  {accommodations?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("type")}</Form.Label>
            <Controller
              control={control}
              name="type_id"
              render={({ field }) => (
                <Form.Select {...field} required>
                  <option value="">{t("select")}</option>
                  {roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("price")}</Form.Label>
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Form.Control type="number" min={0} {...field} required />
              )}
            />
          </Form.Group>

          <Form.Group>
            <Controller
              control={control}
              name="isAvailable"
              render={({ field }) => (
                <Form.Check
                  type="checkbox"
                  label={t("available")}
                  defaultChecked
                  {...field}
                  required
                />
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("images")}</Form.Label>
            <Controller
              control={control}
              name="images"
              render={({ field, fieldState }) => (
                <>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!fieldState.error}
                  />

                  {imagePreviews.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {" "}
                      {imagePreviews.map((src, index) => (
                        <img
                          key={index}
                          src={`${serverUrl}${src}`}
                          alt={`preview-${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                       {" "}
                    </div>
                  )}
                </>
              )}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit">
              {editingRoom ? t("update") : t("save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RoomForm;
