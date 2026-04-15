import HttpClient from '@/api/clients/HttpClient';
import { ICreateJobRequest } from '@/api/models/jobs/ICreateJobRequest';
import { IJobResponse } from '@/api/models/jobs/IJobResponse';
import { IUpdateJobRequest } from '@/api/models/jobs/IUpdateJobRequest';

const config = {
  endpoint: 'jobs',
};

export default class JobService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(config.endpoint);
  }

  getJobsAsync = async () => {
    return this.httpClient.findAsync<IJobResponse[]>();
  };

  getJobAsync = async (id: string) => {
    return this.httpClient.getAsync<IJobResponse>(id);
  };

  createJobAsync = async (model: ICreateJobRequest) => {
    return this.httpClient.postAsync<IJobResponse, ICreateJobRequest>(model);
  };

  updateJobAsync = async (id: string, model: IUpdateJobRequest) => {
    return this.httpClient.putAsync<IJobResponse, IUpdateJobRequest>(id, model);
  };
}
