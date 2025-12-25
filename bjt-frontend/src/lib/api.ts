// src/lib/api.ts
import axios from "axios";
import { Job } from "../types/types";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchJobs = async (): Promise<Job[]> => {
  const { data } = await api.get<Job[]>("/");
  return data;
};

export const createJob = async (name: string): Promise<Job> => {
  const { data } = await api.post<Job>("/", { name });
  return data;
};

export const retryJob = async (jobId: string): Promise<Job> => {
  const { data } = await api.post<Job>(`/${jobId}/retry`);
  return data;
};

export const fetchJobChain = async (jobId: string): Promise<Job[]> => {
  const { data } = await api.get<Job[]>(`/${jobId}/chain`);
  return data;
};
