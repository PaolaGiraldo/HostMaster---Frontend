import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoomInventory, deleteRoomInventory, updateRoomInventory } from "../Services/roomInventoryService";
import { RoomInventory } from '../interfaces/roomInventorynterface';

export const useRoomInventory = (roomId: number | null) => {
  const queryClient = useQueryClient();
  
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['roomInventory', roomId],
    queryFn: () => {
      if (roomId === null) return Promise.resolve([]);
      return getRoomInventory(roomId);
    },
    enabled: roomId !== null,
    staleTime: 1000 * 60 * 5, // 5 minutos de caché fresca
  });

  const deleteProductMutation = useMutation({
    mutationFn: (inventoryId: number) => deleteRoomInventory(inventoryId),
    onSuccess: () => {
      // Actualiza el cache para mantenerlo actualizado después de eliminar
      queryClient.invalidateQueries({ queryKey: ['roomInventory', roomId]});
    },
  });

  const deleteProduct = (inventoryId: number) => {
    deleteProductMutation.mutate(inventoryId);
  };

    // Mutación para actualizar la cantidad del producto
    const updateProductMutation = useMutation({
      mutationFn: (updateInventory: { inventoryId: number, roomInventory: RoomInventory }) => updateRoomInventory(updateInventory.inventoryId, updateInventory.roomInventory),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey:['roomInventory', roomId]});
      },
    });
  
    const updateProductQuantity = (inventoryId: number,roomInventory: RoomInventory, quantity:number, min_quantity: number) => {
      
      roomInventory.min_quantity=min_quantity;
      roomInventory.quantity=quantity
      updateProductMutation.mutate({ inventoryId, roomInventory });

    };
  

  return {
    inventory,
    isLoading,
    deleteProduct,
    updateProductQuantity
  };
};

