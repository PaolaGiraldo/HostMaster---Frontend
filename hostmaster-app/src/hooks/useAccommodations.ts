import { useQuery } from '@tanstack/react-query';
import {
  getAccommodations
} from "../Services/accommodationService";

export const useAccommodations = () => {
    return useQuery({
      queryKey: ["accommodations"],
      queryFn: getAccommodations,
      staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });
  };