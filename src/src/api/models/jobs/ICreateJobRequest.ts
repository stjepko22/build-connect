export interface ICreateJobRequest {
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: number;
  deadline: string;
}
