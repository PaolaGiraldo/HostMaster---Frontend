import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/userService";
import { User } from "../interfaces/userInterface";

export const useUsers = (accommodationId?: number) => {
  return useQuery<User[]>({
    queryKey: ['users', accommodationId],
    queryFn: () => {
      return getUsers();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};