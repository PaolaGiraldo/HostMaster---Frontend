import { Image } from "./imageInterface";
import { Room } from "./roomInterface";

export interface Accommodation {
    id?: number;
    name: string;
    address: string;
    city_id: number;
    cityName?:string;
    information: string;
    images: Image[];
    rooms: Room[]
  }

