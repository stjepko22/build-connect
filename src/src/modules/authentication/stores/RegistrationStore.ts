import { makeAutoObservable, runInAction } from 'mobx';
import RootStore from '@/core/stores/RootStore';
import { LegalType } from '@/modules/user/models/LegalType';

export default class RegistrationStore {
  rootStore: RootStore;
  isLoading = false;
  submitError: string | null = null;
  isSubmitted = false;
  registeredEmail = '';
  isVerificationEmailSent = false;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phone = '';
  role: 'INVESTITOR' | 'IZVODJAC' = 'INVESTITOR';
  legalType: LegalType = 'FIRMA';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setFirstName = (value: string) => { this.firstName = value; };
  setLastName = (value: string) => { this.lastName = value; };
  setEmail = (value: string) => { this.email = value; };
  setPassword = (value: string) => { this.password = value; };
  setPhone = (value: string) => { this.phone = value; };
  setSubmitError = (value: string | null) => { this.submitError = value; };
  setRole = (value: 'INVESTITOR' | 'IZVODJAC') => {
    this.role = value;
    if (value === 'INVESTITOR') {
      this.legalType = 'FIRMA';
    }
  };
  setLegalType = (value: LegalType) => { this.legalType = value; };

  initializeForm = (reset: boolean) => {
    if (reset) {
      runInAction(() => {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.phone = '';
        this.role = 'INVESTITOR';
        this.legalType = 'FIRMA';
        this.submitError = null;
        this.isSubmitted = false;
        this.registeredEmail = '';
        this.isVerificationEmailSent = false;
      });
    }
  };

  clearFormState = () => {
    this.submitError = null;
  };

  get isFormValid() {
    const normalizedPhone = this.phone.trim();
    const isPhoneValid = normalizedPhone.length >= 6;

    return (
      this.firstName.trim().length > 0 &&
      this.lastName.trim().length > 0 &&
      this.email.includes('@') &&
      this.password.length >= 6 &&
      isPhoneValid
    );
  }

  submit = async (): Promise<boolean> => {
    if (!this.isFormValid) return false;

    this.isLoading = true;
    this.submitError = null;

    try {
      const registration = await this.rootStore.authenticationStore.register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        phone: this.phone,
        role: this.role,
        legalType: this.legalType,
      });

      if (!registration) {
        this.submitError = this.rootStore.authenticationStore.authError || 'Registracija nije uspjela.';
      }

      runInAction(() => {
        if (registration) {
          this.isSubmitted = true;
          this.registeredEmail = registration.email;
          this.isVerificationEmailSent = registration.isVerificationEmailSent;
        }
      });

      return !!registration;
    } catch {
      this.submitError = 'Registracija nije uspjela.';
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
}
