import { useQuery } from "@tanstack/react-query";
import { getMaintenances } from "../Services/maintenanceServices";
import { Maintenance } from "../interfaces/maintenanceInterface";

export const useMaintenances = () => {
    return useQuery<Maintenance[]>({
      queryKey: ['maintenances'],
      queryFn: ({ queryKey }) => {
        const [] = queryKey;
        return getMaintenances();
      },
      staleTime: 1000 * 60 * 5, // 5 min
    });
  };
  