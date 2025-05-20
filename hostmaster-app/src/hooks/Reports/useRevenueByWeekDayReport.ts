import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getRevenueByWeekDay } from "../../Services/reportsService";

export const useRevenueByWeekDayReport = (
  accommodationId: number,
  startDate: Date,
  endDate: Date
) => {
  const formattedStart = format(startDate, "yyyy-MM-dd");
  const formattedEnd = format(endDate, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["revenueByDay", formattedStart, formattedEnd, accommodationId],
    queryFn: async () => {
      const params: any = {
        start_date: formattedStart,
        end_date: formattedEnd,
        accommodation_id: accommodationId,
      };
      const revenue = await getRevenueByWeekDay({ params });
      return revenue;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};