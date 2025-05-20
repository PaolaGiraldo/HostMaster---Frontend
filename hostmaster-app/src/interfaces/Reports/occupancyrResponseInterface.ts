export interface OccupancyDataItem {
  date: string;
  occupied_rooms: number;
  occupancy_rate: number;
}

export interface OccupancyResponse {
  accommodation_id: number;
  total_rooms: number,
  occupancy_data: OccupancyDataItem[];
}