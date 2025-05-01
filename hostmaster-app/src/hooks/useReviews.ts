import { useQuery } from "@tanstack/react-query";
import { getReviewByAccommodation } from "../Services/reviewService";
import { Review } from "../interfaces/reviewInterface";

export const useReviews = (accommodationId?: number) => {
  return useQuery<Review[]>({
    queryKey: ['reviews', accommodationId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return getReviewByAccommodation(id as number | undefined);
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

export const useAllAccommodationReviews = (accommodationIds: number[]) => {
  return useQuery({
    queryKey: ['allAccommodationReviews'],
    queryFn: async () => {
      const allReviews = await Promise.all(
        accommodationIds.map(id => getReviewByAccommodation(id))
      );
      return allReviews.flat(); // Junta todas las reseñas en un solo array
    },
    enabled: accommodationIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
