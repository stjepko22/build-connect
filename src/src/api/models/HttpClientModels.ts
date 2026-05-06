import { AxiosRequestConfig } from 'axios';

export type QueryParameterValue = string | number | boolean | null | undefined;
export type QueryParameterValues = QueryParameterValue | QueryParameterValue[];
export type QueryParameters = Record<string, QueryParameterValues>;
export type RequestConfiguration = AxiosRequestConfig;
