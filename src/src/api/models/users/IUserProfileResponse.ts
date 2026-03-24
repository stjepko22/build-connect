import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { LegalType } from '@/modules/user/models/LegalType';

export interface IUserProfileResponse {
  id: string;
  displayName: string;
  role: 'INVESTITOR' | 'IZVODJAC';
  legalType: LegalType;
  email: string;
  bio: string;
  location: string;
  joinedAt: string;
  serviceCategories?: JobCategory[];
}
