import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { Service } from "../../interfaces/serviceInterface";
import { useTranslation } from "react-i18next";

interface ServiceFormProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (service: Service) => void;
  editingService?: Service | null;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  show,
  handleClose,
  onSubmit,
  editingService,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Service>({
    name: "",
    description: "",
    price: 0,
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingService) {
      setFormData(editingService);
    } else {
      setFormData({ name: "", description: "", price: 0 });
    }
  }, [editingService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.price <= 0) {
      //TODO
      alert(t("services.validationError"));
      return;
    }
    onSubmit(formData);
    handleClose();
    setFormData({ name: "", description: "", price: 0 });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingService
            ? t("services.editService")
            : t("services.newService")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>{t("services.service")}</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>{t("description")}</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>{t("price")}</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              {editingService ? t("update") : t("save")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ServiceForm;
