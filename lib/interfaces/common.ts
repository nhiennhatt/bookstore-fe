export interface ErrorResponse {
  title: string;
  errorCode: string;
}

export interface APIResponse<T> {
  data: T;
  error?: ErrorResponse;
}