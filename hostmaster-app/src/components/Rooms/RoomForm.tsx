import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RoomType } from "../../interfaces/roomTypeInterface";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { Room } from "../../interfaces/roomInterface";

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
        //setImages(editingRoom.images[0].url || null);
      });
    }
  }, [editingRoom, reset]);

  useEffect(() => {
    if (!show) {
      reset({
        number: "",
        accommodation_id: 0,
        type_id: 0,
        isAvailable: true,
        price: 0,
        //setImages(editingRoom.images[0].url || null);
      });
      setImagePreviews([]);
    }
  }, [show, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setValue("images", files);

    const previewArray = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewArray);
  };

  const onSubmit = (data: Room) => {
    console.log(data);
    const formData = new FormData();

    images?.forEach((img, index) => {
      formData.append("images[]", img);
    });
    handleClose();
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
              name="roomNumber"
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
                <Form.Select {...field} required disabled={!!editingRoom}>
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
                  checked={field.value}
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
              defaultValue={[]}
              render={({ field, fieldState }) => (
                <>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <Form.Control.Feedback type="invalid">
                      {fieldState.error.message}
                    </Form.Control.Feedback>
                  )}
                </>
              )}
            />
          </Form.Group>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                onHide();
                reset();
                setImagePreviews([]);
              }}
            >
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
