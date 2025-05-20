import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getDailyMetrics } from "../../Services/reportsService";

export const useDailyMetricsReport = (
  accommodationId: number,
  startDate: Date,
  endDate: Date
) => {
  const formattedStart = format(startDate, "yyyy-MM-dd");
  const formattedEnd = format(endDate, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["daily", formattedStart, formattedEnd, accommodationId],
    queryFn: async () => {
      const params: any = {
        start_date: formattedStart,
        end_date: formattedEnd,
        accommodation_id: accommodationId,
      };
      const revenue = await getDailyMetrics({ params });
      return revenue;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};