import { Accommodation } from "./accommodationInterface";
import { Room } from "./roomInterface";
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
    extra_services: InvoiceServices[]
    total_cost: number;
}

interface InvoiceUser{
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    document_number: string;

}

interface InvoiceServices{
    service_name: string;
    price: number;
}

export interface ReservationInvoice {
    reservation_id: number; 
    user: InvoiceUser;
    accommodation: Accommodation;
    room: Room;
    reservation_details: ReservationDetails;
    cost_breakdown: CostBreakdown;
    
    generated_at: string;
  }