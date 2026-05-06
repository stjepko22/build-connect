import HttpClient from '@/api/clients/HttpClient';
import IDashboardResponse from '@/api/models/dashboard/IDashboardResponse';

const config = {
  endpoint: 'dashboard',
};

export default class DashboardService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(config.endpoint);
  }

  getDashboardAsync = async () => {
    return this.httpClient.findAsync<IDashboardResponse>();
  };
}
