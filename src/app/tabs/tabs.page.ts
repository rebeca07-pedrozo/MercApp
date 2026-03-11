import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, scanOutline, personOutline, starOutline, settingsOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule]
})
export class TabsPage {
  constructor(public auth: AuthService) {
    addIcons({ homeOutline, scanOutline, personOutline, starOutline, settingsOutline });
  }
}