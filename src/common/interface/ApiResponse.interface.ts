export interface ApiResponse<T> {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}
