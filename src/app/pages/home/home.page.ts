import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonSpinner, IonCard, IonCardContent,
  IonList, IonListHeader, IonLabel
} from '@ionic/angular/standalone';
import { ProductsService } from '../../services/products.service';
import { Producto, ComparacionProducto } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonSpinner, IonCard, IonCardContent,
    IonList, IonListHeader, IonLabel,
    CommonModule, FormsModule, DecimalPipe, DatePipe
  ]
})
export class HomePage implements OnInit {
  searchTerm = '';
  productos: Producto[] = [];
  comparacion: ComparacionProducto | null = null;
  loading = false;

  constructor(private productsService: ProductsService) {}

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
}