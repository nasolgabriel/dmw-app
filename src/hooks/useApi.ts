import { AxiosInstance } from "axios";
import { useAsync, useAsyncCallback } from "react-async-hook";
import axiosInstance from "../api/axiosInstance";

// Helper: create a generic API object from the Axios instance.
function createApi(client: AxiosInstance) {
  return {
    get: client.get.bind(client),
    post: client.post.bind(client),
    put: client.put.bind(client),
    delete: client.delete.bind(client),
  };
}

type ApiFnWithApi<R, A extends any[]> = (
  api: ReturnType<typeof createApi>,
  ...args: A
) => Promise<R>;
type ApiFnWithoutApi<R, A extends any[]> = (...args: A) => Promise<R>;

/**
 * useApi:
 * Executes an async API function immediately.
 * The async function receives the API object and returns a Promise.
 */
export const useApi = <R, D extends any[]>(
  asyncFn: (api: ReturnType<typeof createApi>) => Promise<R>,
  deps?: D
) => {
  return useAsync(async () => {
    try {
      const api = createApi(axiosInstance);
      return await asyncFn(api);
    } catch (error: any) {
      throw new Error(error);
    }
  }, [axiosInstance, ...(deps || [])]);
};

/**
 * Overloaded useApiCallback:
 * Returns a callback that can be called on demand.
 *
 * It supports functions that either require:
 *   - The API instance and arguments, or
 *   - Just arguments.
 *
 * The second type parameter A is constrained to an array (A extends any[]).
 */

// Overload signatures:
export function useApiCallback<R, A extends any[]>(
  asyncFn: ApiFnWithApi<R, A>
): ReturnType<typeof useAsyncCallback<R, A>>;
export function useApiCallback<R, A extends any[]>(
  asyncFn: ApiFnWithoutApi<R, A>
): ReturnType<typeof useAsyncCallback<R, A>>;

// Implementation:
export function useApiCallback<R, A extends any[]>(
  asyncFn: ApiFnWithApi<R, A> | ApiFnWithoutApi<R, A>
) {
  return useAsyncCallback(async (...args: A) => {
    const api = createApi(axiosInstance);
    // Check the number of declared parameters to decide how to call the function.
    // If asyncFn.length === 1, we assume it expects only the arguments (without API)
    if (asyncFn.length === 1) {
      return await (asyncFn as ApiFnWithoutApi<R, A>)(...args);
    } else {
      return await (asyncFn as ApiFnWithApi<R, A>)(api, ...args);
    }
  });
}
