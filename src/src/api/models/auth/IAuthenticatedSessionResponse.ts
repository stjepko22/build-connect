import { IAuthenticatedUserResponse } from '@/api/models/auth/IAuthenticatedUserResponse';

export interface IAuthenticatedSessionResponse {
  accessToken: string;
  user: IAuthenticatedUserResponse;
}
