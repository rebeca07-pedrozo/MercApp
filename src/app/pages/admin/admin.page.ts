import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment,
  IonSegmentButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonItem, IonLabel, IonInput, IonButton,
  IonSelect, IonSelectOption, IonIcon, IonSearchbar,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { ProductsService } from '../../services/products.service';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonSegment,
    IonSegmentButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonItem, IonLabel, IonInput, IonButton,
    IonSelect, IonSelectOption, IonIcon, IonSearchbar,
    CommonModule, FormsModule, DecimalPipe
  ]
})
export class AdminPage implements OnInit {
  segmento = 'productos';
  productos: Producto[] = [];
  filtro = '';
  editandoId: number | null = null;
  nuevoProducto: Partial<Producto> = {};

  constructor(
    private productsService: ProductsService,
    private toast: ToastController,
    private alert: AlertController
  ) {
    addIcons({ pencilOutline, trashOutline });
  }

  ngOnInit() { this.loadProductos(); }

  loadProductos() {
    this.productsService.getProductos().subscribe(data => this.productos = data);
  }

  get productosFiltrados(): Producto[] {
    if (!this.filtro) return this.productos;
    return this.productos.filter(p =>
      p.nombre?.toLowerCase().includes(this.filtro.toLowerCase()) ||
      p.tienda?.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  onSegmentChange() { this.nuevoProducto = {}; this.editandoId = null; }

  editarProducto(p: Producto) {
    this.editandoId = p.id;
    this.nuevoProducto = { ...p };
    this.segmento = 'agregar';
  }

  guardarProducto() {
    if (this.editandoId) {
      this.productsService.actualizarProducto(this.editandoId, this.nuevoProducto).subscribe({
        next: () => { this.showToast('Producto actualizado ✅', 'success'); this.loadProductos(); this.segmento = 'productos'; },
        error: () => this.showToast('Error al actualizar', 'danger')
      });
    } else {
      this.productsService.agregarProducto(this.nuevoProducto).subscribe({
        next: () => { this.showToast('Producto agregado ✅', 'success'); this.loadProductos(); this.nuevoProducto = {}; },
        error: () => this.showToast('Error al agregar', 'danger')
      });
    }
  }

  async eliminarProducto(id: number) {
    const alert = await this.alert.create({
      header: 'Confirmar',
      message: '¿Eliminar este producto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => {
          this.productsService.eliminarProducto(id).subscribe({
            next: () => { this.showToast('Eliminado', 'warning'); this.loadProductos(); },
            error: () => this.showToast('Error al eliminar', 'danger')
          });
        }}
      ]
    });
    await alert.present();
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({ message: msg, duration: 2000, color });
    t.present();
  }
}