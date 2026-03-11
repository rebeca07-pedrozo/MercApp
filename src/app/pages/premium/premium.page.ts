import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { ProductsService } from '../../services/products.service';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'app-premium',
  templateUrl: 'premium.page.html',
  styleUrls: ['premium.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    CommonModule, DecimalPipe, CurrencyPipe
  ]
})
export class PremiumPage implements OnInit {
  totalProductos = 0;
  promedioExito = 0;
  promedioOlimpica = 0;
  topDiferencias: any[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() { this.loadAnalisis(); }

  loadAnalisis() {
    this.productsService.getProductos().subscribe(productos => {
      this.totalProductos = productos.length;

      const exito = productos.filter(p => p.tienda?.toLowerCase().includes('exito'));
      const olimpica = productos.filter(p => p.tienda?.toLowerCase().includes('olimpica'));

      this.promedioExito = exito.length ? exito.reduce((a, b) => a + b.precio, 0) / exito.length : 0;
      this.promedioOlimpica = olimpica.length ? olimpica.reduce((a, b) => a + b.precio, 0) / olimpica.length : 0;

      // Top diferencias
      const nombresUnicos = [...new Set(productos.map(p => p.nombre))];
      const diferencias = nombresUnicos.map(nombre => {
        const e = exito.find(p => p.nombre === nombre);
        const o = olimpica.find(p => p.nombre === nombre);
        if (e && o) {
          return {
            nombre,
            precioExito: e.precio,
            precioOlimpica: o.precio,
            diferencia: Math.abs(e.precio - o.precio)
          };
        }
        return null;
      }).filter(Boolean) as any[];

      this.topDiferencias = diferencias.sort((a, b) => b.diferencia - a.diferencia).slice(0, 5);
    });
  }
}