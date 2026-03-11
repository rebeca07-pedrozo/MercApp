import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonItem, IonInput, IonButton,
  IonIcon, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, alertCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, FormsModule, CommonModule]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, alertCircleOutline });
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tabs/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Credenciales incorrectas';
      }
    });
  }

  goToRegister() { this.router.navigate(['/register']); }
}