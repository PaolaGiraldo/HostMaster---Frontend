import { useQuery } from "@tanstack/react-query";
import { getReviewByAccommodation } from "../Services/reviewService";

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: getReviewByAccommodation,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
