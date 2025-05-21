import { useQuery } from "@tanstack/react-query";
import { getAccommodations } from "../services/accommodationService";
import { getRoomsByAccommodation } from "../services/roomService";
import { getRoomTypeById } from "../services/roomTypeService";
import { useLocation } from "../context/LocationContext";

export const useAccommodationsComplete = () => {
  const { cities } = useLocation();

  return useQuery({
    queryKey: ["accommodationsComplete"],

    queryFn: async () => {
      const accommodations = await getAccommodations();

      const roomsByAccommodation = await Promise.all(
        accommodations.map((a) => getRoomsByAccommodation(a.id))
      );

      const allRooms = roomsByAccommodation.flat();

      const uniqueTypeIds = [...new Set(allRooms.map((r) => r.type_id))];

      const roomTypes = await Promise.all(
        uniqueTypeIds.map((id) => getRoomTypeById(id))
      );

      const roomTypeMap = new Map(
        uniqueTypeIds.map((id, i) => [id, roomTypes[i]])
      );

      const enriched = accommodations.map((accommodation, index) => {
        const rooms = roomsByAccommodation[index].map((room) => ({
          ...room,
          roomType: roomTypeMap.get(room.type_id),
        }));

        const cityName =
          cities.find((c) => c.id === accommodation.city_id)?.name || "";

        return {
          ...accommodation,
          cityName,
          rooms,
        };
      });

      return enriched;
    },

    staleTime: 1000 * 60 * 5 * 12, // 5 minutos
  });
};
