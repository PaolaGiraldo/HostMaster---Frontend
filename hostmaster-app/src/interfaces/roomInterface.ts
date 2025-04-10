import { Image } from "./imageInterface";
export interface Room {
    id?: number;
    accommodation_id: number;
    type_id: number;
    number: string;
    price: number;
    info: string;
    images: Image[];
    isAvailable: boolean
  }