import { Image } from "./imageInterface";
import { RoomInventory } from "./roomInventorynterface";

export interface Room {
    id?: number;
    accommodation_id: number;
    type_id: number;
    number: string;
    price: number;
    info: string;
    images: Image[];
    isAvailable: boolean;
    inventory_items: RoomInventory[];
  }