import axiosInstance from "./axiosInstance";
import { LoginCredentials, LoginResponse } from "../types/auth";
import { firstStepForm } from "@/types/firstStepForm";
import { currentClientResponse } from "@/types/currentClient";
import { ClientTable } from "@/types/clientTable";

export const loginApi = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

export const clientInfo = async (
  clientinfo: firstStepForm
): Promise<string> => {
  const response = await axiosInstance.post("/clients", clientinfo);
  return response.data;
};

export const logoutApi = async (message: string): Promise<string> => {
  const access_token = localStorage.getItem("access_token");
  await axiosInstance.post("/auth/logout", {
    access_token,
  });
  return message;
};

export const getCurrentClient = async (
  id: string | number
): Promise<currentClientResponse> => {
  const response = await axiosInstance.get(`/clients/${id}`);
  return response.data.data;
};

export const getTicketNumber = async (id: number): Promise<string> => {
  const response = await axiosInstance.get(`/queues/${id}`);
  return response.data.data.ticket_number;
};

export const getClientTable = async (
  division: string
): Promise<ClientTable[]> => {
  const response = await axiosInstance.get(
    `/queues/division/${encodeURIComponent(division)}`
  );

  return response.data.data.queues.map((queue: any) => ({
    id: queue.client.id,
    ticket_number: queue.ticket_number,
    name: [
      queue.client.firstName,
      queue.client.middleName,
      queue.client.lastName,
    ]
      .filter(Boolean)
      .join(" "),
    time: queue.created_at.split("T")[1].slice(0, 5),
  }));
};

export const clientTransfer = async (
  id: number,
  divisionName: string
): Promise<string> => {
  const response = await axiosInstance.post(`queues/${id}/change-division`, {
    division: divisionName,
  });
  return response.data;
};
