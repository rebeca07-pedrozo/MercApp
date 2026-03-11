import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, ComparacionProducto } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProductos(tienda?: string): Observable<Producto[]> {
    let params = new HttpParams();
    if (tienda) params = params.set('tienda', tienda);
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`, { params });
  }

  buscarProducto(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`, {
      params: new HttpParams().set('nombre', nombre)
    });
  }

  compararPrecios(nombre: string): Observable<ComparacionProducto> {
  return this.buscarProducto(nombre).pipe(
    map(productos => {
      // Filtramos por nombre
      const filtrados = productos.filter(p =>
        p.nombre?.toLowerCase().includes(nombre.toLowerCase())
      );

      const olimpica = filtrados.find(p =>
        p.tienda?.toLowerCase().includes('olimpica') ||
        p.tienda?.toLowerCase().includes('olímpica')
      );
      const exito = filtrados.find(p =>
        p.tienda?.toLowerCase().includes('exito') ||
        p.tienda?.toLowerCase().includes('éxito')
      );

      let diferencia: number | undefined;
      let masBarato: string | undefined;

      if (olimpica && exito) {
        diferencia = Math.abs(olimpica.precio - exito.precio);
        masBarato = olimpica.precio < exito.precio ? 'Olímpica' : 'Éxito';
      }

      return {
        nombre,
        marca: olimpica?.marca || exito?.marca || '',
        olimpica,
        exito,
        diferencia,
        masBarato
      };
    })
  );
}

  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }

  agregarProducto(producto: Partial<Producto>): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto);
  }

  actualizarProducto(id: number, producto: Partial<Producto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}