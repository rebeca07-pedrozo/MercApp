import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async crearPaymentIntent(amount: number, currency: string = 'cop'): Promise<string> {
    const res: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/stripe/create-payment-intent`, { amount, currency })
    );
    return res.clientSecret;
  }

  planes = [
    {
      id: 'basic',
      nombre: 'Básico',
      precio: 0,
      descripcion: 'Acceso a comparación de precios básica',
      features: ['Buscar productos', 'Ver precios', 'Comparar 2 tiendas']
    },
    {
      id: 'premium',
      nombre: 'Premium',
      precio: 9900,
      descripcion: 'Análisis completo y funciones avanzadas',
      features: ['Todo lo básico', 'Historial de precios', 'Gráficas y análisis', 'Alertas de precio', 'Fotos de productos']
    }
  ];
}