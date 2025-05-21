// hooks/useOccupancyReport.ts
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../../services/reportsService";
import { format } from "date-fns";

export const useSummaryReport = (
  accommodationId: number,
  startDate: Date,
  endDate: Date
) => {
  const formattedStart = format(startDate, "yyyy-MM-dd");
  const formattedEnd = format(endDate, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["summary", formattedStart, formattedEnd, accommodationId],
    queryFn: async () => {
      const params: any = {
        start_date: formattedStart,
        end_date: formattedEnd,
        accommodation_id: accommodationId,
      };
      const occupancy = await getSummary({ params });
      return occupancy;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
