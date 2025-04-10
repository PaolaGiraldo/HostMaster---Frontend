export interface Service {
    id?: number; // Opcional porque al crear un nuevo servicio aún no tiene ID
    name: string;
    description: string;
    price: number;
  }