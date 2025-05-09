import { useQuery } from "@tanstack/react-query";
import { getClients } from "../Services/userService";
import { User } from "../interfaces/userInterface";

export const useClients = (accommodationId?: number) => {
  return useQuery<User[]>({
    queryKey: ['reviews', accommodationId],
    queryFn: () => {
      return getClients();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};