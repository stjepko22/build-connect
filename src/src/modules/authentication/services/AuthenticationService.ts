import { IAuthenticatedSessionResponse } from '@/api/models/auth/IAuthenticatedSessionResponse';
import HttpClient from '@/api/clients/HttpClient';
import { ILoginRequest } from '@/api/models/auth/ILoginRequest';
import { IRegisterRequest } from '@/api/models/auth/IRegisterRequest';
import { IRegistrationResponse } from '@/api/models/auth/IRegistrationResponse';
import { IResendVerificationEmailRequest } from '@/api/models/auth/IResendVerificationEmailRequest';
import { IVerifyEmailRequest } from '@/api/models/auth/IVerifyEmailRequest';

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
    return this.httpClient.postAsync<IRegistrationResponse, IRegisterRequest>(model, 'register');
  };

  verifyEmailAsync = async (model: IVerifyEmailRequest) => {
    return this.httpClient.postAsync<void, IVerifyEmailRequest>(model, 'verify-email');
  };

  resendVerificationEmailAsync = async (model: IResendVerificationEmailRequest) => {
    return this.httpClient.postAsync<IRegistrationResponse, IResendVerificationEmailRequest>(model, 'resend-verification-email');
  };
}
