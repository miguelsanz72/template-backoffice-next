export interface IResponseList<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}