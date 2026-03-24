import HttpClient from '@/api/clients/HttpClient';
import { QueryParameters } from '@/api/models/HttpClientModels';
import { IUserProfileResponse } from '@/api/models/users/IUserProfileResponse';

const usersConfig = {
  endpoint: 'users',
};

const contractorsConfig = {
  endpoint: 'contractors',
};

export default class UserService {
  usersHttpClient: HttpClient;
  contractorsHttpClient: HttpClient;

  constructor() {
    this.usersHttpClient = new HttpClient(usersConfig.endpoint);
    this.contractorsHttpClient = new HttpClient(contractorsConfig.endpoint);
  }

  getUsersAsync = async (query: QueryParameters = {}) => {
    return this.usersHttpClient.findAsync<IUserProfileResponse[]>(query);
  };

  getUserAsync = async (id: string) => {
    return this.usersHttpClient.getAsync<IUserProfileResponse>(id);
  };

  getContractorsAsync = async () => {
    return this.contractorsHttpClient.findAsync<IUserProfileResponse[]>();
  };
}
