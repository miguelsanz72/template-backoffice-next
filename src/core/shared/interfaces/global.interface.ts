import { AxiosError } from 'axios';

export interface IResponseMessage {
  message: string;
}

export interface IResponseErrorApi extends AxiosError {
  data: {
    message?: string | string[];
    code?: string;
    statusCode?: number;
    path?: string;
    timestamp?: string;
    innerError?: string;
    errors?: Record<string, string[]>;
    [key: string]: unknown;
  };
}
