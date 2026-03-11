import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonBadge, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { loadScript } from '@paypal/paypal-js';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonBadge, IonIcon, CommonModule
  ]
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  showPayment = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.user = this.auth.currentUser;
  }

  getRolColor(): string {
    const colors: Record<string, string> = {
      admin: 'danger',
      premium: 'warning',
      basic: 'medium'
    };
    return colors[this.user?.rol || 'basic'];
  }

  async upgradeToPremium() {
    this.showPayment = true;
    setTimeout(() => this.cargarPayPal(), 300);
  }

  async cargarPayPal() {
    try {
      const paypal = await loadScript({
        clientId: 'AduN60-7RigeF52Q3xosQ-VLwo7g6FR9QJtVx2wJRKZewDLkaE62KcDTpT8Vt-vrbT4s3LvpvFQ_F627',
        currency: 'USD'
      });

      if (!paypal || !paypal.Buttons) return;

      await paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'pay'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: 'MercApp Premium — 1 mes',
              amount: {
                currency_code: 'USD',
                value: '2.50'
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          if (order.status === 'COMPLETED') {
            if (this.user) this.user.rol = 'premium';
            this.showPayment = false;
            const t = await this.toast.create({
              message: '✅ ¡Pago exitoso! Bienvenido a Premium 🎉',
              duration: 3000,
              color: 'success'
            });
            t.present();
          }
        },
        onError: async (err: any) => {
          const t = await this.toast.create({
            message: '❌ Error al procesar el pago',
            duration: 2000,
            color: 'danger'
          });
          t.present();
        }
      }).render('#paypal-button-container');

    } catch (e) {
      console.error('Error cargando PayPal', e);
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}