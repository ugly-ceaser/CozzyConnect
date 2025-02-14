export interface RequestResponse<T> {
  data: T,
  message: string;
  status: boolean;
  shouldLogout?: boolean;
}