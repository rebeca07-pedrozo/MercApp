export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  tienda: string;
  cantidad: string;
  fecha_actualizacion: string;
}

export interface ComparacionProducto {
  nombre: string;
  marca: string;
  olimpica?: Producto;
  exito?: Producto;
  diferencia?: number;
  masBarato?: string;
}