import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { LegalType } from '@/modules/user/models/LegalType';

export interface IUpdateUserProfileRequest {
  displayName: string;
  legalType: LegalType;
  phone?: string;
  isPhoneVisible?: boolean;
  bio: string;
  location: string;
  serviceCategories?: JobCategory[];
}
