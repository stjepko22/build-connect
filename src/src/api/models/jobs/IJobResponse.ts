export interface IJobResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: number;
  deadline: string;
  investitorId: string;
  createdAt: string;
  status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
}
