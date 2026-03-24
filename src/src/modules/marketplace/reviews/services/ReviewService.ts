import HttpClient from '@/api/clients/HttpClient';
import { QueryParameters, RequestConfiguration } from '@/api/models/HttpClientModels';
import { ICreateReviewRequest } from '@/api/models/reviews/ICreateReviewRequest';
import { IReviewResponse } from '@/api/models/reviews/IReviewResponse';

const config = {
  endpoint: 'reviews',
};

export default class ReviewService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(config.endpoint);
  }

  getReviewsAsync = async (query: QueryParameters = {}) => {
    return this.httpClient.findAsync<IReviewResponse[]>(query);
  };

  createReviewAsync = async (jobId: string, model: ICreateReviewRequest) => {
    const requestConfiguration: RequestConfiguration = {
      url: `/jobs/${jobId}/reviews`,
    };

    return this.httpClient.postAsync<IReviewResponse, ICreateReviewRequest>(model, '', requestConfiguration);
  };
}
