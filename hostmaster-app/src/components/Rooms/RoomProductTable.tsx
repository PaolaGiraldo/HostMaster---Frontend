import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Product } from "../../interfaces/roomProductInterface";

interface RoomProductProps {
  roomProducts: Product[];
  onAdd: (roomProduct: Product) => void;
  onEdit: (roomProduct: Product) => void;
  onDelete: (id?: number) => void;
}

const RoomProductTable: React.FC<RoomProductProps> = ({
  roomProducts,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingRoomProduct, setEditingRoomProduct] = useState<Product | null>(
    null
  );
  const [selectedRoomProductId, setSelectedRoomProdcutId] = useState<
    number | null
  >(null);

  const handleShowModal = (roomProduct: Product | null = null) => {
    setEditingRoomProduct(roomProduct);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoomProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRoomProduct) {
      console.error("No room product data provided");
      return;
    }

    try {
      if (editingRoomProduct.id) {
        onEdit(editingRoomProduct);
      } else {
        await onAdd({
          name: editingRoomProduct.name,
          description: editingRoomProduct.description,
          price: editingRoomProduct.price,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving room type", error);
    }
  };

  const handleDeleteClick = (roomTypeId?: number) => {
    setSelectedRoomProdcutId(roomTypeId ?? null);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedRoomProductId !== null) {
      onDelete(selectedRoomProductId);
    }
    setShowConfirm(false);
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => handleShowModal()}
        className="mb-3"
      >
        {t("roomProducts.addNew")}
      </Button>
      <div className="table-responsive">
        <Table striped bordered hover className="room-type-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("roomProducts.product")}</th>
              <th>{t("description")}</th>
              <th>{t("price")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {roomProducts.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(product)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para crear/editar productos de habitación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRoomProduct
              ? t("roomProducts.edit")
              : t("roomProducts.addNew")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t("roomProducts.product")}</Form.Label>
              <Form.Control
                type="text"
                value={editingRoomProduct?.name || ""}
                onChange={(e) =>
                  setEditingRoomProduct({
                    ...editingRoomProduct!,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("description")}</Form.Label>
              <Form.Control
                as="textarea"
                value={editingRoomProduct?.description || ""}
                onChange={(e) =>
                  setEditingRoomProduct({
                    ...editingRoomProduct!,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("price")}</Form.Label>
              <Form.Control
                type="number"
                value={editingRoomProduct?.price || ""}
                onChange={(e) =>
                  setEditingRoomProduct({
                    ...editingRoomProduct!,
                    price: Number(e.target.value),
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {t("roomTypes.save")}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("roomProducts.confirmDelete")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoomProductTable;
