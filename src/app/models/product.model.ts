export interface Producto {
  id?: number;
  nombre: string;
  marca: string;
  precio: number;
  tienda: string;
  cantidad?: string;
  cantidad_normalizada?: string;
}

export interface ComparacionProducto {
  nombre: string;
  olimpica?: Producto;
  exito?: Producto;
  masBarato?: string;
  diferencia?: number;
}