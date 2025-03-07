import axiosInstance from "./axiosInstance";

export const getAll = async <T>(endpoint: string): Promise<T[]> => {
  const response = await axiosInstance.get(endpoint);
  return response.data;
};

export const getOne = async <T>(
  endpoint: string,
  id: string | number
): Promise<T> => {
  const response = await axiosInstance.get(`${endpoint}/${id}`);
  return response.data;
};

export const create = async <T>(endpoint: string, data: T): Promise<T> => {
  const response = await axiosInstance.post(endpoint, data);
  return response.data;
};

export const update = async <T>(
  endpoint: string,
  id: string | number,
  data: Partial<T>
): Promise<T> => {
  const response = await axiosInstance.put(`${endpoint}/${id}`, data);
  return response.data;
};

export const remove = async (
  endpoint: string,
  id: string | number
): Promise<void> => {
  await axiosInstance.delete(`${endpoint}/${id}`);
};
