export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface Job {
  jobId: string;
  name: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  parentJobId?: string;
  attempt: number;
  maxAttempts: number;
}
