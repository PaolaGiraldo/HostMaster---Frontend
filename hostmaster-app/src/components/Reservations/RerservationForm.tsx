import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { Reservation } from "../../interfaces/reservationInterface";
import { useClients } from "../../hooks/useUsers";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useRoomsByAccommodation } from "../../hooks/useRoomsByAccommodation";
import { useServices } from "../../hooks/useServices";
import { Service } from "../../interfaces/serviceInterface";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { reservationStatuses } from "../../constants/reservationStatusList";

interface ReservationFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (data: Reservation) => void;
  editingReservation?: Reservation | null;
}

interface SelectedService extends Service {
  quantity: number;
}
const ReservationForm: React.FC<ReservationFormProps> = ({
  show,
  onHide,
  onSave,
  editingReservation,
}) => {
  const { t } = useTranslation();

  const { data: clients } = useClients();
  const { data: accommodations } = useAccommodations();
  const { data: services } = useServices();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    []
  );
  const [serviceToAdd, setServiceToAdd] = useState<number | "">("");
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<Reservation>();

  const handleClose = () => {
    reset();
    onHide();
  };

  const onSubmit = (data: Reservation) => {
    onSave(data);
    handleClose();
    reset();
  };

  const selectedAccommodation = watch("accommodation_id");
  const { data: rooms } = useRoomsByAccommodation(selectedAccommodation);

  useEffect(() => {
    if (editingReservation) reset(editingReservation);
  }, [editingReservation, reset]);

  const handleAddService = () => {
    if (!serviceToAdd || quantityToAdd < 1) return;

    const found = services?.find((s: Service) => s.id === serviceToAdd);
    if (found && !selectedServices.some((s) => s.id === serviceToAdd)) {
      const updated = [
        ...selectedServices,
        { ...found, quantity: quantityToAdd },
      ];
      setSelectedServices(updated);
      setValue("extra_services", updated);
      setServiceToAdd("");
      setQuantityToAdd(1);
    }
  };

  const handleRemoveService = (id: number) => {
    const updated = selectedServices.filter((s) => s.id !== id);
    setSelectedServices(updated);
    setValue("extra_services", updated);
  };

  const availableServices = services?.filter(
    (s: Service) => !selectedServices.some((sel) => sel.id === s.id)
  );

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (editingReservation?.start_date) {
      const start = new Date(editingReservation.start_date);
      const end = new Date(editingReservation.end_date);
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  }, [editingReservation]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingReservation ? t("reservations.edit") : t("reservations.new")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
            <Form.Label>{t("room")}</Form.Label>
            <Controller
              control={control}
              name="room_id"
              render={({ field }) => (
                <Form.Select {...field} required>
                  <option value="">{t("select")}</option>
                  {rooms?.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.number}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("customer")}</Form.Label>
            <Controller
              control={control}
              name="user_username"
              render={({ field }) => (
                <Form.Select {...field} required>
                  <option value="">{t("select")}</option>
                  {clients?.map((u) => (
                    <option key={u.username} value={u.username}>
                      {u.full_name}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>

          <Form.Group className="w-100">
            <Form.Label>{t("reservations.date_range")}</Form.Label>
            <div>
              <DatePicker
                wrapperClassName="datepicker"
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                  if (start)
                    setValue("start_date", format(start, "yyyy-MM-dd"));
                  if (end) setValue("end_date", format(end, "yyyy-MM-dd"));
                }}
                isClearable
                className="form-control w-100"
                dateFormat="yyyy-MM-dd"
                placeholderText={t("select")}
              />
            </div>
            {(errors.start_date || errors.end_date) && (
              <Form.Text className="text-danger">
                {t("validation.required")}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("reservations.guest_count")}</Form.Label>
            <Controller
              control={control}
              name="guest_count"
              render={({ field }) => (
                <Form.Control type="number" min={1} {...field} required />
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("reservations.status")}</Form.Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Form.Select>
                  {reservationStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {t(status.labelKey)}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("reservations.extraservices")}</Form.Label>
          </Form.Group>

          <Button variant={"outline-primary"} size="sm">
            <span className="d-none d-md-inline"> servicios adicionales</span>
          </Button>

          <Form.Group className="mt-3">
            <Form.Label>Servicios adicionales</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Select
                value={serviceToAdd}
                onChange={(e) => setServiceToAdd(Number(e.target.value))}
              >
                <option value="">Selecciona un servicio</option>
                {availableServices?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                type="number"
                min={1}
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(Number(e.target.value))}
                placeholder="Cantidad"
                style={{ maxWidth: "100px" }}
              />
              <Button variant="success" onClick={handleAddService}>
                Agregar
              </Button>
            </div>

            <div className="mt-2">
              {selectedServices.map((s) => (
                <div
                  key={s.id}
                  className="d-flex justify-content-between align-items-center border p-2 mb-1"
                >
                  <span>
                    {s.name} - <strong>{s.quantity} unidad(es)</strong>
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveService(s.id!)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("reservations.observations")}</Form.Label>
            <Controller
              control={control}
              name="observations"
              render={({ field }) => (
                <Form.Control as="textarea" rows={3} {...field} />
              )}
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              {editingReservation ? t("update") : t("save")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReservationForm;
