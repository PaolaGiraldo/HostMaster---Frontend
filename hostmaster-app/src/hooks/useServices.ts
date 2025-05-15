import { useQuery } from "@tanstack/react-query";
import { getServices } from "../Services/serviceService";
import { Service } from "../interfaces/serviceInterface";

export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: ({ queryKey }) => {
      const [] = queryKey;
      return getServices();
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
