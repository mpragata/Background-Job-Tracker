// Job Status
export type JobStatus = "pending" | "running" | "completed" | "failed";

// Job
export interface Job {
  jobId: string;
  name: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  parentJobId?: string;
  attempt?: number;
  maxAttempts?: number;
}
