import { LegalType } from '@/modules/user/models/LegalType';

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  role: 'INVESTITOR' | 'IZVODJAC';
  legalType: LegalType;
}
