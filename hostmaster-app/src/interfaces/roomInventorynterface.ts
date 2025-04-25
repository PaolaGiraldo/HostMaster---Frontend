export interface RoomInventory
 {
    id?: number;
    room_id: number;
    product_name: string;
    quantity: number;
    min_quantity: number;
    needs_restock: boolean;
  }