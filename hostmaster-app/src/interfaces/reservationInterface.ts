import { Service } from "./serviceInterface";

export interface Reservation {
    id?: number; 
    accommodation_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    guest_count: number;
    user_username: string;
    extra_services: Service[];
    status: string;
    observations: string
  }