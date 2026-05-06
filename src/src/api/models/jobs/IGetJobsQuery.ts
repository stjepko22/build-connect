import { QueryParameters } from '@/api/models/HttpClientModels';
import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';

export interface IGetJobsQuery extends QueryParameters {
  q?: string;
  category?: JobCategory[];
}

export default IGetJobsQuery;
