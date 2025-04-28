import axiosInstance from "./axiosInstance";
import { LoginCredentials, LoginResponse } from "../types/auth";
import { firstStepForm } from "@/types/firstStepForm";
import { currentClientResponse } from "@/types/currentClient";
import { ClientTable } from "@/types/clientTable";
import { QueueDisplayData, QueueDisplayResponse } from "@/types/queueDisplay";

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
  // Filter out queues with "processing" status, only keep "in queue"
  const filteredQueues = response.data.data.queues.filter(
    (queue: any) => queue.status === "in queue"
  );
  return filteredQueues.map((queue: any) => ({
    id: queue.client.id,
    ticket_number: queue.ticket_number,
    name: [
      queue.client.firstName,
      queue.client.middleName,
      queue.client.lastName,
    ]
      .filter(Boolean)
      .join(" "),
    time: new Date(queue.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
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

export const getQueueDisplay = async (): Promise<QueueDisplayData[]> => {
  const response = await axiosInstance.get<QueueDisplayResponse>(
    "/queues/division/"
  );
  return response.data.data;
};

export const assignWindowClient = async (
  counter_id: number,
  client_id: number
) => {
  const access_token = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `/counters/${counter_id}/pick-ticket/${client_id}`,
    {
      counter_id,
      client_id,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

export const getCurrentClientByCounter = async (
  counter_id: number
): Promise<currentClientResponse> => {
  const response = await axiosInstance.get(`/clients/${counter_id}`);
  return response.data.data;
};

export const doneApi = async (
  id: number
): Promise<{ status: string }> => {
  const response = await axiosInstance.put(`/queues/${id}/status`, {
    status: "completed",
  });
  return response.data;
};
