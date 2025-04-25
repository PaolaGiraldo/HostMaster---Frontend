import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { RoomInventory } from "../../interfaces/roomInventorynterface";
import { Product } from "../../interfaces/roomProductInterface";

type AddProductModalProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: RoomInventory) => void;
  availableProducts: Product[];
};

export default function AddProductModal({
  show,
  onClose,
  onSubmit,
  availableProducts,
}: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomInventory>();

  const { t } = useTranslation();

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitForm = (data: RoomInventory) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("inventory.addProduct")}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Modal.Body>
          <Form.Group controlId="productId">
            <Form.Label>{t("roomProducts.product")}</Form.Label>
            <Form.Select {...register("product_name", { required: true })}>
              <option value="">{t("inventory.selectProduct")}</option>
              {availableProducts.map((prod) => (
                <option key={prod.id} value={prod.name}>
                  {prod.name}
                </option>
              ))}
            </Form.Select>
            {errors.product_name && (
              <Form.Text className="text-danger">{t("missingField")}</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="quantity" className="mt-3">
            <Form.Label>{t("inventory.quantity")}</Form.Label>
            <Form.Control
              type="number"
              min={0}
              {...register("quantity", { required: true })}
            />
            {errors.quantity && (
              <Form.Text className="text-danger">{t("missingField")}</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="min_quantity" className="mt-3">
            <Form.Label>{t("inventory.minQuantity")}</Form.Label>
            <Form.Control
              type="number"
              min={0}
              {...register("min_quantity", { required: true })}
            />
            {errors.min_quantity && (
              <Form.Text className="text-danger">{t("missingField")}</Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {t("save")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
