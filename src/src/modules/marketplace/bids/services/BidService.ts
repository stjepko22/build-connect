import HttpClient from '@/api/clients/HttpClient';
import { QueryParameters, RequestConfiguration } from '@/api/models/HttpClientModels';
import { IBidResponse } from '@/api/models/bids/IBidResponse';
import { ICreateBidRequest } from '@/api/models/bids/ICreateBidRequest';

const config = {
  endpoint: 'bids',
};

export default class BidService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(config.endpoint);
  }

  getBidsAsync = async (query: QueryParameters = {}) => {
    return this.httpClient.findAsync<IBidResponse[]>(query);
  };

  createBidAsync = async (jobId: string, model: ICreateBidRequest) => {
    const requestConfiguration: RequestConfiguration = {
      url: `/jobs/${jobId}/bids`,
    };

    return this.httpClient.postAsync<IBidResponse, ICreateBidRequest>(model, '', requestConfiguration);
  };

  acceptBidAsync = async (bidId: string) => {
    return this.httpClient.postAsync<IBidResponse[], Record<string, never>>({}, `${bidId}/accept`);
  };
}
