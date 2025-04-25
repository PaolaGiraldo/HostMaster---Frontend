import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Table, Spinner, Form } from "react-bootstrap";
import { useRoomInventory } from "../../hooks/useRoomIneventory";
import AddProductModal from "./AddProductModal";
import { RoomInventory } from "../../interfaces/roomInventorynterface";
import { useAvailableProducts } from "../../hooks/useAvailableProducts";
import { createRoomInventory } from "../../Services/roomInventoryService";
import QuantityEditor from "../Inventory/QuantityEditor";

interface RoomInventoryModalProps {
  show: boolean;
  onClose: () => void;
  roomId: number;
}

const RoomInventoryModal: React.FC<RoomInventoryModalProps> = ({
  show,
  onClose,
  roomId,
}) => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(
    null
  );
  const { t } = useTranslation();
  const { inventory, isLoading, deleteProduct, updateProductQuantity } =
    useRoomInventory(roomId);
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: availableProducts } = useAvailableProducts();

  const handleAddProduct = async (product: RoomInventory) => {
    product.room_id = roomId;
    product.needs_restock = product.quantity < product.min_quantity;
    await createRoomInventory(product);
    queryClient.invalidateQueries({ queryKey: ["availableProducts"] });
    queryClient.invalidateQueries({ queryKey: ["roomInventory", roomId] });
  };

  const filteredProducts = useMemo(() => {
    if (!availableProducts || !inventory) return [];

    const inventoryProductNames = new Set(inventory.map((p) => p.product_name));
    return availableProducts.filter(
      (product) => !inventoryProductNames.has(product.name)
    );
  }, [availableProducts, inventory]);

  const handleDelete = (productId: number) => {
    setSelectedInventoryId(productId ?? null);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    console.log(selectedInventoryId);
    if (selectedInventoryId !== null) {
      deleteProduct(selectedInventoryId);
    }
    setShowConfirm(false);
  };

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("inventory.roomInventory")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            variant="primary"
            className="mb-3"
            onClick={() => {
              setShowAddModal(true);
            }}
          >
            {t("inventory.addProduct")}
          </Button>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t("roomProducts.product")}</th>
                  <th>{t("inventory.quantity")}</th>
                  <th>{t("inventory.minQuantity")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inventory?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>
                      <QuantityEditor
                        initialQuantity={item.quantity}
                        onSave={(newQty) =>
                          updateProductQuantity(
                            item.id!,
                            item,
                            newQty,
                            item.min_quantity
                          )
                        }
                      />
                    </td>
                    <td>
                      <QuantityEditor
                        initialQuantity={item.min_quantity}
                        onSave={(newMin) =>
                          updateProductQuantity(
                            item.id!,
                            item,
                            item.quantity,
                            newMin
                          )
                        }
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(item.id!)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>

        <AddProductModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
          availableProducts={filteredProducts!}
        />
      </Modal>
      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirmDelete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("rooms.confirmDelete")}</Modal.Body>
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

export default RoomInventoryModal;
