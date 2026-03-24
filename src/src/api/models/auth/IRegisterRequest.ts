import { LegalType } from '@/modules/user/models/LegalType';

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'INVESTITOR' | 'IZVODJAC';
  legalType?: LegalType;
}
