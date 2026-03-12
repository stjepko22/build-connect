import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { LegalType } from '@/modules/user/models/LegalType';

export interface IUserProfile {
  id: string;
  displayName: string;
  role: 'INVESTITOR' | 'IZVODJAC';
  legalType: LegalType;
  email: string;
  bio: string;
  location: string;
  joinedAt: Date;
  serviceCategories?: JobCategory[];
}
