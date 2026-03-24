import { IAuthenticatedSessionResponse } from '@/api/models/auth/IAuthenticatedSessionResponse';
import HttpClient from '@/api/clients/HttpClient';
import { ILoginRequest } from '@/api/models/auth/ILoginRequest';
import { IRegisterRequest } from '@/api/models/auth/IRegisterRequest';

const config = {
  endpoint: 'auth',
};

export default class AuthenticationService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(config.endpoint);
  }

  loginAsync = async (model: ILoginRequest) => {
    return this.httpClient.postAsync<IAuthenticatedSessionResponse, ILoginRequest>(model, 'login');
  };

  registerAsync = async (model: IRegisterRequest) => {
    return this.httpClient.postAsync<IAuthenticatedSessionResponse, IRegisterRequest>(model, 'register');
  };
}
