import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { LegalType } from '@/modules/user/models/LegalType';

export interface IUpdateUserProfileRequest {
  displayName: string;
  legalType: LegalType;
  bio: string;
  location: string;
  serviceCategories?: JobCategory[];
}
