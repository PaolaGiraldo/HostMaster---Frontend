import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { Reservation } from "../../interfaces/reservationInterface";
import { useClients } from "../../hooks/useCustomers";
import { useAccommodations } from "../../hooks/useAccommodations";
import { useRoomsByAccommodation } from "../../hooks/useRoomsByAccommodation";
import { useServices } from "../../hooks/useServices";
import { Service } from "../../interfaces/serviceInterface";
import DatePicker from "react-datepicker";
import { format, parseISO, set } from "date-fns";
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

type ReservationFormValues = Reservation & {
  date_range?: [Date | null, Date | null];
  start_date: string;
  end_date: string;
};
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
  } = useForm<ReservationFormValues>({
    defaultValues: {
      accommodation_id: 0,
      room_id: 0,
      user_username: "",
      start_date: "",
      end_date: "",
      guest_count: 1,
      status: "",
      observations: "",
      extra_services: [],
      date_range: [null, null],
    },
  });

  useEffect(() => {
    if (!show) {
      reset({
        accommodation_id: 0,
        room_id: 0,
        user_username: "",
        start_date: "",
        end_date: "",
        guest_count: 1,
        status: "",
        observations: "",
        extra_services: [],
        date_range: [null, null],
      });
      setSelectedServices([]);
      setServiceToAdd("");
      setQuantityToAdd(1);
    }
  }, [show, reset]);

  const handleClose = () => {
    reset();
    onHide();
  };

  const onSubmit = (data: ReservationFormValues) => {
    (data.id = editingReservation?.id), onSave(data);

    handleClose();
    reset();
  };

  const selectedAccommodation = watch("accommodation_id");
  const { data: rooms } = useRoomsByAccommodation(selectedAccommodation);

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

  useEffect(() => {
    if (editingReservation) {
      reset({
        accommodation_id: editingReservation.accommodation_id,
        room_id: editingReservation.room_id,
        guest_count: editingReservation.guest_count,
        status: editingReservation.status,
        observations: editingReservation.observations,
        user_username: editingReservation.user_username,
        extra_services: editingReservation.extra_services,
      });
      const start = parseISO(editingReservation.start_date); // sin cambio de día
      const end = parseISO(editingReservation.end_date);

      setValue("date_range", [start, end]);
      setValue("start_date", format(start, "yyyy-MM-dd"));
      setValue("end_date", format(end, "yyyy-MM-dd"));
    } else {
    }
  }, [editingReservation, reset]);

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
                <Form.Select
                  {...field}
                  required
                  disabled={!!editingReservation}
                >
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
                <Form.Select
                  {...field}
                  required
                  disabled={!!editingReservation}
                >
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
              <Controller
                name="date_range"
                control={control}
                rules={{ required: t("validation.required") }}
                render={({ field }) => (
                  <DatePicker
                    wrapperClassName="datepicker"
                    selectsRange
                    startDate={field.value?.[0]}
                    endDate={field.value?.[1]}
                    onChange={(dates: [Date | null, Date | null]) => {
                      field.onChange(dates);

                      const [start, end] = dates;
                      if (start)
                        setValue("start_date", format(start, "yyyy-MM-dd"));
                      if (end) setValue("end_date", format(end, "yyyy-MM-dd"));
                    }}
                    isClearable
                    className="form-control w-100"
                    dateFormat="yyyy-MM-dd"
                    placeholderText={t("select")}
                  />
                )}
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
                <Form.Select {...field} required>
                  <option value="">{t("select")}</option>
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
            <Button variant="secondary" onClick={handleClose}>
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
