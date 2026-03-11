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

  compararPrecios(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/comparar`, {
      params: new HttpParams().set('nombre', nombre)
    });
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