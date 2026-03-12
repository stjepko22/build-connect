import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';

export interface IJob {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  budget?: number;
  deadline: string;
  investitorId: string;
  createdAt: Date;
}
