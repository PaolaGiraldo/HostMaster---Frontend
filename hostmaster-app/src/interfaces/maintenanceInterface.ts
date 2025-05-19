export interface Maintenance {
    id?: number;
    accommodation_id: number;
    room_id: number;
    created_at: string;
    updated_at: string;
    created_by: string;
    assigned_to: string;
    description: string;
    priority: string;
    status: string;
  }
  