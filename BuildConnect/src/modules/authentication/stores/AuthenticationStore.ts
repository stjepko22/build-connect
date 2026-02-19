import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/stores/RootStore';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'INVESTITOR' | 'IZVODJAC';
}

export class AuthenticationStore {
  rootStore: RootStore;
  user: User | null = null;
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return !!this.user;
  }

  login = async (email: string, _password: string, role: 'INVESTITOR' | 'IZVODJAC') => {
    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.user = {
          id: role === 'INVESTITOR' ? 'investitor-1' : 'izvodjac-1', // Matchamo mock ID-ove
          email,
          displayName: role === 'INVESTITOR' ? 'Ivan Investitor' : 'Marko Majstor',
          role: role
        };
        this.isLoading = false;
        console.log("Korisnik prijavljen:", this.user);
        resolve();
      }, 500);
    });
  };

  logout = () => {
    this.user = null;
  };
}