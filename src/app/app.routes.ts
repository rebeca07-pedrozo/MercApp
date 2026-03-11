import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'scanner',
        loadComponent: () => import('./pages/scanner/scanner.page').then(m => m.ScannerPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'premium',
        canActivate: [roleGuard],
        data: { roles: ['premium', 'admin'] },
        loadComponent: () => import('./pages/premium/premium.page').then(m => m.PremiumPage)
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];