import { AxiosRequestConfig } from 'axios';

export type QueryParameterValue = string | number | boolean | null | undefined;
export type QueryParameters = Record<string, QueryParameterValue>;
export type RequestConfiguration = AxiosRequestConfig;
