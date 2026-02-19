import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/stores/RootStore';

export type UserRole = 'INVESTITOR' | 'IZVODJAC' | null;

interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export class AuthenticationStore {
  rootStore: RootStore;
  user: User | null = null;
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  login = async (email: string, role: UserRole) => {
    this.isLoading = true;
    // Simulacija API poziva
    setTimeout(() => {
      this.user = {
        id: '1',
        email: email,
        displayName: email.split('@')[0],
        role: role
      };
      this.isLoading = false;
      console.log(`Korisnik prijavljen kao: ${role}`);
    }, 1000);
  };

  logout = () => {
    this.user = null;
  };

  get isAuthenticated() {
    return !!this.user;
  }
}