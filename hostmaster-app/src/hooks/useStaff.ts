import { useQuery } from "@tanstack/react-query";
import { User } from "../interfaces/userInterface";
import { getStaff } from "../Services/userService";

export const useStaff = (accommodationId?: number) => {
  return useQuery<User[]>({
    queryKey: ['staff', accommodationId],
    queryFn: () => {
      return getStaff();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};;