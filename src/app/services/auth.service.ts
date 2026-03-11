import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  async loadStoredUser() {
    const { value } = await Preferences.get({ key: 'user' });
    if (value) {
      this.currentUserSubject.next(JSON.parse(value));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
    tap(async (res: any) => {
      const user: User = {
        id: res.id || 0,
        email: res.email,
        rol: res.rol || 'basic'
      };
      await Preferences.set({ key: 'user', value: JSON.stringify(user) });
      await Preferences.set({ key: 'token', value: res.token || '' });
      this.currentUserSubject.next(user);
    })
    );
  }

  register(email: string, password: string, rol: string = 'basic'): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, rol });
  }

  async logout() {
    await Preferences.remove({ key: 'user' });
    await Preferences.remove({ key: 'token' });
    this.currentUserSubject.next(null);
  }

  async getToken(): Promise<string> {
    const { value } = await Preferences.get({ key: 'token' });
    return value || '';
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? roles.includes(user.rol) : false;
  }
}