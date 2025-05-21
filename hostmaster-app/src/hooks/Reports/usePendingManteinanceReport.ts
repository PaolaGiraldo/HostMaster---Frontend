import { useQuery } from "@tanstack/react-query";

import { getPendingMaintenances } from "../../services/reportsService";

export const usePendingMaintenanceReport = (
  accommodationId: number
) => {

  return useQuery({
    queryKey: ["maintenance", accommodationId],
    queryFn: async () => {
      const params: any = {
        accommodation_id: accommodationId,
      };
      const revenue = await getPendingMaintenances({ params });
      return revenue;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};