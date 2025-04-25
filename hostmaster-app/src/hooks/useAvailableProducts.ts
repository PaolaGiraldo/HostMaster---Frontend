import { useQuery  } from "@tanstack/react-query";
import { getProducts } from "../Services/productsService"; 
import { Product } from "../interfaces/roomProductInterface"; 

export const useAvailableProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["availableProducts"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60 * 24, 
    refetchOnWindowFocus: false,
  });
};
