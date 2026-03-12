import { makeAutoObservable } from 'mobx';
import RootStore from '@/core/stores/RootStore';
import { IUser } from '@/modules/authentication/models/IUser';
import { LegalType } from '@/modules/user/models/LegalType';

export default class AuthenticationStore {
  rootStore: RootStore;
  user: IUser | null = null;
  isLoading: boolean = false;

  // Novo polje za globalno upravljanje dijalogom
  isLoginDialogOpen: boolean = false;

  // Polja za formu
  loginEmail = 'investitor@buildconnect.hr';
  loginPassword = 'invest123';
  loginRole: 'INVESTITOR' | 'IZVODJAC' = 'INVESTITOR';

  private readonly mockCredentialsByRole: Record<'INVESTITOR' | 'IZVODJAC', { email: string; password: string }> = {
    INVESTITOR: { email: 'investitor@buildconnect.hr', password: 'invest123' },
    IZVODJAC: { email: 'izvodjac@buildconnect.hr', password: 'izvodjac123' },
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Nova akcija za otvaranje i zatvaranje dijaloga
  setLoginDialogOpen = (value: boolean) => {
    this.isLoginDialogOpen = value;
    if (value) {
      this.applyMockCredentialsForRole(this.loginRole);
    }
  };

  // Akcije za ažuriranje polja
  setLoginEmail = (value: string) => { this.loginEmail = value; };
  setLoginPassword = (value: string) => { this.loginPassword = value; };
  setLoginRole = (value: 'INVESTITOR' | 'IZVODJAC') => {
    this.loginRole = value;
    this.applyMockCredentialsForRole(value);
  };

  applyMockCredentialsForRole = (role: 'INVESTITOR' | 'IZVODJAC') => {
    const mock = this.mockCredentialsByRole[role];
    this.loginEmail = mock.email;
    this.loginPassword = mock.password;
  };

  private getDefaultLegalTypeByRole = (role: 'INVESTITOR' | 'IZVODJAC'): LegalType => {
    return role === 'INVESTITOR' ? 'FIRMA' : 'FIZICKA_OSOBA';
  };

  get isAuthenticated() {
    return !!this.user;
  }

  // Provjera je li forma validna (jednostavna verzija)
  get isLoginFormValid() {
    return this.loginEmail.includes('@') && this.loginPassword.length >= 6;
  }

  login = async () => {
    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.user = {
          id: this.loginRole === 'INVESTITOR' ? 'investitor-1' : 'izvodjac-1',
          email: this.loginEmail,
          displayName: this.loginRole === 'INVESTITOR' ? 'Ivan Investitor' : 'Marko Majstor',
          role: this.loginRole,
          legalType: this.getDefaultLegalTypeByRole(this.loginRole),
        };
        this.isLoading = false;
        
        // Resetiranje forme nakon prijave
        this.loginEmail = '';
        this.loginPassword = '';
        
        // Automatsko zatvaranje dijaloga nakon uspješne prijave
        this.setLoginDialogOpen(false);
        
        console.log("Korisnik prijavljen:", this.user);
        resolve();
      }, 500);
    });
  };

  register = async (
    email: string,
    _password: string,
    role: 'INVESTITOR' | 'IZVODJAC',
    legalType?: LegalType
  ) => {
    this.isLoading = true;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.user = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          displayName: email.split('@')[0],
          role: role,
          legalType: legalType || this.getDefaultLegalTypeByRole(role),
        };
        this.isLoading = false;
        console.log("Korisnik registriran:", this.user);
        resolve();
      }, 800);
    });
  };

  logout = () => {
    this.user = null;
  };
}

