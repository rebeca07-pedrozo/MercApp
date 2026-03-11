import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonInput, IonButton, IonIcon, IonSpinner, IonButtons,
  IonBackButton, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    IonInput, IonButton, IonIcon, IonSpinner, IonButtons,
    IonBackButton, FormsModule, CommonModule
  ]
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  register() {
    if (!this.email || !this.password) { this.errorMsg = 'Completa todos los campos'; return; }
    if (this.password !== this.confirmPassword) { this.errorMsg = 'Las contraseñas no coinciden'; return; }
    if (this.password.length < 6) { this.errorMsg = 'La contraseña debe tener mínimo 6 caracteres'; return; }

    this.loading = true;
    this.auth.register(this.email, this.password).subscribe({
      next: async () => {
        this.loading = false;
        const t = await this.toast.create({ message: '✅ Cuenta creada. Inicia sesión', duration: 2000, color: 'success' });
        t.present();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error al registrarse';
      }
    });
  }
}