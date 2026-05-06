import { QueryParameters } from '@/api/models/HttpClientModels';
import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { LegalType } from '@/modules/user/models/LegalType';

export interface IGetContractorsQuery extends QueryParameters {
  q?: string;
  category?: JobCategory[];
  location?: string;
  legalType?: LegalType;
}

export default IGetContractorsQuery;
