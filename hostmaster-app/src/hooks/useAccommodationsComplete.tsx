import { useQuery } from "@tanstack/react-query";
import { getAccommodations } from "../Services/accommodationService";
import { getRoomsByAccommodation } from "../Services/roomService";
import { getRoomTypeById } from "../Services/roomTypeService";
import { useLocation } from "../context/LocationContext";

export const useAccommodationsComplete = () => {
  const { cities } = useLocation();

  return useQuery({
    queryKey: ["accommodationsComplete"],
    queryFn: async () => {
      const accommodations = await getAccommodations();

      // Cache para evitar llamadas repetidas a getRoomTypeById
      const roomTypeCache = new Map<number, any>();

      const enriched = await Promise.all(
        accommodations.map(async (accommodation) => {
          const rooms = await getRoomsByAccommodation(accommodation.id);

          const roomsWithTypes = await Promise.all(
            rooms.map(async (room) => {
              if (!roomTypeCache.has(room.type_id)) {
                const type = await getRoomTypeById(room.type_id);
                roomTypeCache.set(room.type_id, type);
              }
              return { ...room, roomType: roomTypeCache.get(room.type_id) };
            })
          );

          const cityName =
            cities.find((c) => c.id === accommodation.city_id)?.name || "";

          return {
            ...accommodation,
            cityName,
            rooms: roomsWithTypes,
          };
        })
      );

      return enriched;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
