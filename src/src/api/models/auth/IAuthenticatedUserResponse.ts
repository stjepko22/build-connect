import { LegalType } from '@/modules/user/models/LegalType';

export interface IAuthenticatedUserResponse {
  id: string;
  email: string;
  displayName: string;
  role: 'INVESTITOR' | 'IZVODJAC';
  legalType: LegalType;
  phone?: string;
  isPhoneVisible?: boolean;
}
