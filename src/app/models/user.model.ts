export interface User {
  id: number;
  email: string;
  rol: 'admin' | 'premium' | 'basic';
  token?: string;
  foto?: string;
}