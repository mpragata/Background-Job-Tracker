/**
 * job.service.ts
 *
 * functions for creating, running, get1, getall, retry and get job chain
 *
 */
import { connectDB } from "../config/db";
import { Job } from "../types/job";
import { randomUUID } from "crypto";

// run job helper
const runJobLifecycle = async (jobId: string) => {
  const db = await connectDB();

  // simulate polling
  setTimeout(async () => {
    await db
      .collection<Job>("jobs")
      .updateOne(
        { jobId },
        { $set: { status: "running", updatedAt: new Date() } }
      );

    setTimeout(async () => {
      const isSuccess = Math.random() > 0.3;

      await db.collection<Job>("jobs").updateOne(
        { jobId },
        {
          $set: {
            status: isSuccess ? "completed" : "failed",
            updatedAt: new Date(),
          },
        }
      );
    }, Math.random() * 3000 + 3000);
  }, Math.random() * 1000 + 1000);
};

// create job with attempt and max attempt
export const createJob = async (
  name: string,
  parentJobId?: string,
  attempt = 1,
  maxAttempts = 3
): Promise<Job> => {
  const jobId = randomUUID();
  const now = new Date();

  const job: Job = {
    jobId,
    name,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    parentJobId,
    attempt,
    maxAttempts,
  };

  const db = await connectDB();
  await db.collection<Job>("jobs").insertOne(job);
  runJobLifecycle(jobId);

  return job;
};

// get 1 job
export const getJob = async (jobId: string): Promise<Job | null> => {
  const db = await connectDB();
  return await db.collection<Job>("jobs").findOne({ jobId });
};

// get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  const db = await connectDB();
  return await db
    .collection<Job>("jobs")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
};

// retry job
export const retryJob = async (jobId: string): Promise<Job> => {
  const db = await connectDB();
  const existingJob = await db.collection<Job>("jobs").findOne({ jobId });

  if (!existingJob) throw new Error("Job not found");

  if (existingJob.status !== "failed")
    throw new Error("Only failed jobs can be retried");

  // determine root job id
  const rootJobId = existingJob.parentJobId || existingJob.jobId;

  // Fetch all jobs in the chain, sorted by attempt
  const chain = await db
    .collection<Job>("jobs")
    .find({ $or: [{ jobId: rootJobId }, { parentJobId: rootJobId }] })
    .sort({ attempt: 1 })
    .toArray();

  // Check if there is any succeeding attempt that completed
  const futureComplete = chain
    .filter((j) => j.attempt! > existingJob.attempt!)
    .some((j) => j.status === "completed");

  if (futureComplete) {
    throw new Error(
      "Cannot retry: a later attempt has already completed successfully."
    );
  }

  // generate next attempt
  const nextAttempt = chain.length + 1;

  return createJob(existingJob.name, rootJobId, nextAttempt);
};

// get job chain
export const getJobChain = async (jobId: string): Promise<Job[]> => {
  const db = await connectDB();

  const job = await db.collection<Job>("jobs").findOne({ jobId });
  if (!job) throw new Error("Job not found");

  // get root job id
  const rootJobId = job.parentJobId || job.jobId;

  return db
    .collection<Job>("jobs")
    .find({
      $or: [{ jobId: rootJobId }, { parentJobId: rootJobId }],
    })
    .sort({ createdAt: 1 })
    .toArray();
};
