import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { ErrorResponse, APIResponse } from "../interfaces/common";

export async function callAPIWrapper<T>(
  api: () => Promise<AxiosResponse<T>>,
): Promise<APIResponse<T>> {
  try {
    const res = await api();
    return { data: res.data, error: undefined };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorResponse = axiosError.response?.data;
      return { data: undefined as T, error: errorResponse };
    }
    return {
      data: undefined as T,
      error: {
        title: (error as Error).message,
        errorCode: "UNKNOWN_ERROR",
      },
    };
  }
}
