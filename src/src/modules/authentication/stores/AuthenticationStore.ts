import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { IAuthenticatedSessionResponse } from '@/api/models/auth/IAuthenticatedSessionResponse';
import { IRegisterRequest } from '@/api/models/auth/IRegisterRequest';
import RootStore from '@/core/stores/RootStore';
import { IUser } from '@/modules/authentication/models/IUser';
import { authTokenStorageKey, authUnauthorizedEventName, authUserStorageKey } from '@/modules/authentication/constants/authStorage';
import AuthenticationService from '@/modules/authentication/services/AuthenticationService';

export default class AuthenticationStore {
  rootStore: RootStore;
  authenticationService: AuthenticationService;
  user: IUser | null = null;
  isLoading = false;
  authError: string | null = null;
  isLoginDialogOpen = false;
  pendingUnauthorizedLoginPrompt = false;
  loginEmail = '';
  loginPassword = '';
  loginRole: 'INVESTITOR' | 'IZVODJAC' = 'INVESTITOR';

  private readonly loginEmailSuggestionsByRole: Record<'INVESTITOR' | 'IZVODJAC', string> = {
    INVESTITOR: '',
    IZVODJAC: '',
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.authenticationService = new AuthenticationService();
    this.user = this.getStoredUser();
    makeAutoObservable(this);

    if (typeof window !== 'undefined') {
      window.addEventListener(authUnauthorizedEventName, this.handleUnauthorizedLogout);
    }
  }

  setLoginDialogOpen = (value: boolean) => {
    this.isLoginDialogOpen = value;
    if (value) {
      this.authError = null;
      this.applyLoginRoleDefaults(this.loginRole);
    }
  };

  setLoginEmail = (value: string) => {
    this.loginEmail = value;
    this.authError = null;
  };

  setLoginPassword = (value: string) => {
    this.loginPassword = value;
    this.authError = null;
  };

  setLoginRole = (value: 'INVESTITOR' | 'IZVODJAC') => {
    this.loginRole = value;
    this.authError = null;
    this.applyLoginRoleDefaults(value);
  };

  setAuthError = (value: string | null) => {
    this.authError = value;
  };

  applyLoginRoleDefaults = (role: 'INVESTITOR' | 'IZVODJAC') => {
    const suggestedEmail = this.loginEmailSuggestionsByRole[role];
    this.loginEmail = suggestedEmail;
    this.loginPassword = '';
  };

  get isAuthenticated() {
    return !!this.user;
  }

  get isLoginFormValid() {
    return this.loginEmail.includes('@') && this.loginPassword.length >= 6;
  }

  login = async () => {
    this.isLoading = true;
    this.authError = null;

    try {
      const response = await this.authenticationService.loginAsync({
        email: this.loginEmail,
        password: this.loginPassword,
      });

      runInAction(() => {
        this.applyAuthenticatedSession(response.data);
        this.isLoginDialogOpen = false;
        this.authError = null;
        this.loginEmail = '';
        this.loginPassword = '';
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.authError = this.getApiErrorMessage(error, 'Prijava nije uspjela.');
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  register = async (request: IRegisterRequest) => {
    this.isLoading = true;
    this.authError = null;

    try {
      const response = await this.authenticationService.registerAsync(request);

      runInAction(() => {
        this.applyAuthenticatedSession(response.data);
        this.authError = null;
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.authError = this.getApiErrorMessage(error, 'Registracija nije uspjela.');
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  logout = () => {
    this.user = null;
    this.authError = null;
    this.pendingUnauthorizedLoginPrompt = false;
    localStorage.removeItem(authUserStorageKey);
    localStorage.removeItem(authTokenStorageKey);
  };

  handleUnauthorizedLogout = () => {
    this.user = null;
    this.authError = 'Sesija je istekla. Prijavite se ponovno.';
    this.isLoginDialogOpen = false;
    this.pendingUnauthorizedLoginPrompt = true;
    localStorage.removeItem(authUserStorageKey);
    localStorage.removeItem(authTokenStorageKey);
  };

  clearUnauthorizedLoginPrompt = () => {
    this.pendingUnauthorizedLoginPrompt = false;
  };

  private applyAuthenticatedSession = (session: IAuthenticatedSessionResponse) => {
    this.user = {
      ...session.user,
    };

    localStorage.setItem(authUserStorageKey, JSON.stringify(session.user));
    localStorage.setItem(authTokenStorageKey, session.accessToken);
  };

  private getStoredUser = () => {
    const storedUser = localStorage.getItem(authUserStorageKey);
    const storedToken = localStorage.getItem(authTokenStorageKey);

    if (!storedUser || !storedToken) {
      localStorage.removeItem(authUserStorageKey);
      localStorage.removeItem(authTokenStorageKey);
      return null;
    }

    try {
      return JSON.parse(storedUser) as IUser;
    } catch {
      localStorage.removeItem(authUserStorageKey);
      localStorage.removeItem(authTokenStorageKey);
      return null;
    }
  };

  private getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallbackMessage;
  };
}
