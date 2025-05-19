import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Maintenance } from "../../interfaces/maintenanceInterface";
import { Accommodation } from "../../interfaces/accommodationInterface";
import { useRoomsByAccommodation } from "../../hooks/useRoomsByAccommodation";
import {
  maintenancePriorities,
  maintenanceStatuses,
} from "../../constants/maintenanceStatusList";
import { User } from "../../interfaces/userInterface";

interface MaintenanceFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (maintenance: Maintenance) => void;
  accommodations: Accommodation[];
  staff: User[];
  editingMaintenance?: Maintenance;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  show,
  onHide,
  onSave,
  accommodations,
  staff,
  editingMaintenance,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editingMaintenance) {
      reset({
        accommodation_id: editingMaintenance.accommodation_id,
        room_id: editingMaintenance.room_id,
        priority: editingMaintenance.priority,
        description: editingMaintenance.description,
        status: editingMaintenance.status,
      });
      const selectedPerson = personOptions.find(
        (option) => option.value === editingMaintenance.assigned_to
      );
      setValue("assigned_to", selectedPerson);
      console.log(control._fields);
    }
  }, [editingMaintenance, reset]);

  useEffect(() => {
    if (!show) {
      reset({
        accommodation_id: 0,
        room_id: 0,
        priority: "",
        assigned_to: "",
        description: "",
        status: "",
      });
    }
  }, [show, reset]);

  const selectedAccommodation = watch("accommodation_id");
  const { data: rooms } = useRoomsByAccommodation(selectedAccommodation);

  const onSubmit = async (data: any) => {
    (data.id = editingMaintenance?.id),
      (data.assigned_to = data.assigned_to.value),
      onSave(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  const personOptions = staff.map((person) => ({
    value: person.username,
    label: person.full_name,
  }));

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMaintenance
              ? t("maintenances.edit")
              : t("maintenances.new")}
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
                    disabled={!!editingMaintenance}
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
                  <Form.Select
                    {...field}
                    required
                    disabled={!!editingMaintenance}
                  >
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
              <Form.Label>{t("maintenances.priority")}</Form.Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Form.Select {...field} required>
                    <option value="">{t("select")}</option>
                    {maintenancePriorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {t(priority.labelKey)}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("maintenances.responsible")}</Form.Label>
              <Controller
                control={control}
                name="assigned_to"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={personOptions}
                    isClearable
                    isSearchable
                    placeholder={t("select")}
                    value={field.value}
                    onChange={(option: { value: any }) =>
                      field.onChange(option)
                    }
                  />
                )}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("maintenances.status")}</Form.Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Form.Select {...field} required>
                    <option value="">{t("select")}</option>
                    {maintenanceStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {t(status.labelKey)}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("maintenances.description")}</Form.Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Form.Control as="textarea" rows={3} {...field} required />
                )}
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button variant="primary" type="submit">
                {editingMaintenance ? t("update") : t("save")}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MaintenanceForm;
