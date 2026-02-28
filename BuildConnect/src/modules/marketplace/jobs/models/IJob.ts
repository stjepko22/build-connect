export interface IJob {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: number;
  deadline: string;
  investitorId: string;
  createdAt: Date;
}
