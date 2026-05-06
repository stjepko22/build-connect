import axios from '@/api/clients/axios';
import { QueryParameters, RequestConfiguration } from '@/api/models/HttpClientModels';
import { AxiosResponse } from 'axios';

export default class HttpClient {
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  endpoint: string;

  findAsync = async <T>(
    query: QueryParameters = {},
    optionalUrl = '',
    requestConfiguration: RequestConfiguration = {}
  ): Promise<AxiosResponse<T>> => {
    return axios.get<T>(this.buildUrl(optionalUrl), {
      ...requestConfiguration,
      params: {
        ...query,
        ...(requestConfiguration.params ?? {}),
      },
    });
  };

  getAsync = async <T>(
    id = '',
    optionalUrl = '',
    requestConfiguration: RequestConfiguration = {}
  ): Promise<AxiosResponse<T>> => {
    return axios.get<T>(this.buildUrl(this.joinSegments(id, optionalUrl)), requestConfiguration);
  };

  postAsync = async <TResponse, TRequest extends object>(
    model: TRequest,
    optionalUrl = '',
    requestConfiguration: RequestConfiguration = {}
  ): Promise<AxiosResponse<TResponse>> => {
    const requestUrl = typeof requestConfiguration.url === 'string'
      ? requestConfiguration.url
      : this.buildUrl(optionalUrl);

    return axios.post<TResponse>(requestUrl, model, requestConfiguration);
  };

  putAsync = async <TResponse, TRequest extends object>(
    id: string,
    model: TRequest,
    optionalUrl = '',
    requestConfiguration: RequestConfiguration = {}
  ): Promise<AxiosResponse<TResponse>> => {
    return axios.put<TResponse>(this.buildUrl(this.joinSegments(id, optionalUrl)), model, requestConfiguration);
  };

  deleteAsync = async <TResponse>(
    id: string,
    optionalUrl = '',
    requestConfiguration: RequestConfiguration = {}
  ): Promise<AxiosResponse<TResponse>> => {
    return axios.delete<TResponse>(this.buildUrl(this.joinSegments(id, optionalUrl)), requestConfiguration);
  };

  private buildUrl(path = '') {
    const normalizedEndpoint = this.normalizeSegment(this.endpoint);
    const normalizedPath = this.normalizeSegment(path);

    if (!normalizedPath) {
      return `/${normalizedEndpoint}`;
    }

    return `/${normalizedEndpoint}/${normalizedPath}`;
  }

  private joinSegments(...segments: string[]) {
    return segments
      .map((segment) => this.normalizeSegment(segment))
      .filter(Boolean)
      .join('/');
  }

  private normalizeSegment(segment: string) {
    return segment.replace(/^\/+|\/+$/g, '');
  }
}
