import { Accommodation } from "./accommodationInterface";
import { Room } from "./roomInterface";
import { Service } from "./serviceInterface";
import { User } from "./userInterface";

interface ReservationDetails{
    start_date: string;
    end_date: string;
    number_of_nights: number;
    guest_count: number;
    status: string;
    observations: string;
}

interface CostBreakdown {
    room_cost: number;
    extra_services_cost: number;
    extra_services: Service[]
}

export interface ReservationInvoice {
    id?: number; 
    user: User;
    accommodation: Accommodation;
    room: Room;
    reservation_details: ReservationDetails;
    cost_breakdown: CostBreakdown;
    total_cost: number;
    generated_at: string;
  }