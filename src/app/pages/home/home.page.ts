import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonSpinner, IonCard, IonCardContent,
  IonList, IonListHeader, IonLabel, IonSegment,
  IonSegmentButton, IonItem, IonInput, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline } from 'ionicons/icons';
import { ProductsService } from '../../services/products.service';
import { Producto, ComparacionProducto } from '../../models/product.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonSpinner, IonCard, IonCardContent,
    IonList, IonListHeader, IonLabel, IonSegment,
    IonSegmentButton, IonItem, IonInput, IonButton, IonIcon,
    CommonModule, FormsModule, DecimalPipe, DatePipe
  ]
})
export class HomePage implements OnInit {
  segmento = 'comparar';
  searchTerm = '';
  productos: Producto[] = [];
  comparacion: ComparacionProducto | null = null;
  loading = false;

  // Calculadora descuento
  precioOriginal: number = 0;
  porcentajeDescuento: number = 0;
  resultadoDescuento: any = null;

  // Planea tu mercado
  nuevoItem = '';
  listaItems: string[] = [];
  resultadoMercado: any[] = [];
  loadingMercado = false;
  totalMercado = 0;

  constructor(
    private productsService: ProductsService,
    private http: HttpClient
  ) {
    addIcons({ addOutline, closeOutline });
  }

  ngOnInit() { this.loadProductos(); }

  loadProductos() {
    this.loading = true;
    this.productsService.getProductos().subscribe({
      next: (data) => { this.productos = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch(event: any) {
    const term = event.target.value?.trim();
    if (!term || term.length < 2) {
      this.comparacion = null;
      return;
    }
    this.loading = true;
    this.productsService.compararPrecios(term).subscribe({
      next: (data) => { this.comparacion = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // ===== CALCULADORA DESCUENTO =====
  calcularDescuento() {
    if (!this.precioOriginal || !this.porcentajeDescuento) return;
    const valorDescuento = (this.precioOriginal * this.porcentajeDescuento) / 100;
    const precioFinal = this.precioOriginal - valorDescuento;
    this.resultadoDescuento = { valorDescuento, precioFinal };
  }

  // ===== PLANEA TU MERCADO =====
  agregarItem() {
    const item = this.nuevoItem.trim();
    if (item && !this.listaItems.includes(item)) {
      this.listaItems.push(item);
      this.nuevoItem = '';
    }
  }

  eliminarItem(index: number) {
    this.listaItems.splice(index, 1);
  }

  async planearMercado() {
    if (this.listaItems.length === 0) return;
    this.loadingMercado = true;
    this.resultadoMercado = [];
    this.totalMercado = 0;

    try {
      const resultado: any = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/planear-mercado`, this.listaItems)
      );
      this.resultadoMercado = resultado;
      this.totalMercado = resultado.reduce((acc: number, r: any) => {
        return acc + (r.recomendado?.precio || 0);
      }, 0);
    } catch (e) {
      console.error('Error planear mercado', e);
    }
    this.loadingMercado = false;
  }
}