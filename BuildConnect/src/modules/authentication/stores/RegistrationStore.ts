import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/core/stores/RootStore';

export default class RegistrationStore {
  rootStore: RootStore;
  isLoading = false;

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phone = '';
  role: 'INVESTITOR' | 'IZVODJAC' = 'INVESTITOR';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setFirstName = (value: string) => { this.firstName = value; };
  setLastName = (value: string) => { this.lastName = value; };
  setEmail = (value: string) => { this.email = value; };
  setPassword = (value: string) => { this.password = value; };
  setPhone = (value: string) => { this.phone = value; };
  setRole = (value: 'INVESTITOR' | 'IZVODJAC') => { this.role = value; };

  initializeForm = (reset: boolean) => {
    if (reset) {
      runInAction(() => {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.phone = '';
        this.role = 'INVESTITOR';
      });
    }
  };

  clearFormState = () => {
    // Čišćenje resursa ako je potrebno
  };

  get isFormValid() {
    return (
      this.firstName.trim().length > 0 &&
      this.lastName.trim().length > 0 &&
      this.email.includes('@') &&
      this.password.length >= 6
    );
  }

  submit = async (): Promise<boolean> => {
    if (!this.isFormValid) return false;

    this.isLoading = true;
    try {
      // Pozivamo AuthenticationStore register metodu
      await this.rootStore.authenticationStore.register(
        this.email,
        this.password,
        this.role
      );
      // Ako register u AuthenticationStore prođe bez greške (resolve), vraćamo true
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
}
