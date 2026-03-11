import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, imagesOutline, trashOutline } from 'ionicons/icons';
import { CameraService, UserPhoto } from '../../services/camera.service';

@Component({
  selector: 'app-scanner',
  templateUrl: 'scanner.page.html',
  styleUrls: ['scanner.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, CommonModule, AsyncPipe
  ]
})
export class ScannerPage {
  constructor(
    public cameraService: CameraService,
    private toast: ToastController
  ) {
    addIcons({ cameraOutline, imagesOutline, trashOutline });
  }

  async tomarFoto() {
    try {
      await this.cameraService.addNewPhoto();
      const t = await this.toast.create({ message: '📷 Foto guardada', duration: 1500, color: 'success' });
      t.present();
    } catch (e) {
      const t = await this.toast.create({ message: 'Error al acceder a la cámara', duration: 2000, color: 'danger' });
      t.present();
    }
  }

  async seleccionarGaleria() {
    try {
      await this.cameraService.selectFromGallery();
    } catch (e) {}
  }

  async eliminarFoto(photo: UserPhoto) {
    this.cameraService.deletePhoto(photo);
    const t = await this.toast.create({ message: '🗑️ Foto eliminada', duration: 1500, color: 'warning' });
    t.present();
  }
}