/**
 * job.service.test.ts
 *
 * Unit tests for job.service.ts
 * Focus: retry rules, job chaining, business logic
 */

import { createJob, retryJob, getJobChain } from "../services/job.service";
import { connectDB } from "../config/db";
import { Job } from "../types/job";

jest.mock("../config/db");

jest.useFakeTimers();

const mockJobs: Job[] = [];

const mockDb = {
  collection: jest.fn(() => ({
    insertOne: jest.fn((job: Job) => {
      mockJobs.push(job);
      return Promise.resolve({ insertedId: job.jobId });
    }),
    findOne: jest.fn((query: any) =>
      Promise.resolve(mockJobs.find((j) => j.jobId === query.jobId) || null)
    ),
    find: jest.fn((query: any) => {
      let result = mockJobs;

      if (query?.$or) {
        result = mockJobs.filter(
          (j) =>
            j.jobId === query.$or[0].jobId ||
            j.parentJobId === query.$or[1].parentJobId
        );
      }

      return {
        sort: jest.fn(() => ({
          toArray: jest.fn(() => Promise.resolve(result)),
        })),
      };
    }),
    updateOne: jest.fn(() => Promise.resolve()),
  })),
};

(connectDB as jest.Mock).mockResolvedValue(mockDb);

// ---- TESTS ----
describe("Job Service", () => {
  beforeEach(() => {
    mockJobs.length = 0;
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("creates a job with pending status", async () => {
      const job = await createJob("Test Job");

      expect(job.name).toBe("Test Job");
      expect(job.status).toBe("pending");
      expect(job.attempt).toBe(1);
      expect(mockJobs.length).toBe(1);
    });
  });

  describe("retryJob", () => {
    it("throws if job does not exist", async () => {
      await expect(retryJob("missing-id")).rejects.toThrow("Job not found");
    });

    it("throws if job is not failed", async () => {
      mockJobs.push({
        jobId: "job-1",
        name: "Job",
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
        attempt: 1,
        maxAttempts: 3,
      });

      await expect(retryJob("job-1")).rejects.toThrow(
        "Only failed jobs can be retried"
      );
    });

    it("throws if a later attempt already completed", async () => {
      mockJobs.push(
        {
          jobId: "root",
          name: "Job",
          status: "failed",
          createdAt: new Date(),
          updatedAt: new Date(),
          attempt: 1,
          maxAttempts: 3,
        },
        {
          jobId: "child",
          name: "Job",
          status: "completed",
          parentJobId: "root",
          createdAt: new Date(),
          updatedAt: new Date(),
          attempt: 2,
          maxAttempts: 3,
        }
      );

      await expect(retryJob("root")).rejects.toThrow(
        "later attempt has already completed"
      );
    });

    it("creates a new retry attempt when allowed", async () => {
      mockJobs.push({
        jobId: "root",
        name: "Job",
        status: "failed",
        createdAt: new Date(),
        updatedAt: new Date(),
        attempt: 1,
        maxAttempts: 3,
      });

      const newJob = await retryJob("root");

      expect(newJob.attempt).toBe(2);
      expect(newJob.parentJobId).toBe("root");
      expect(mockJobs.length).toBe(2);
    });
  });

  describe("getJobChain", () => {
    it("returns all jobs in the chain", async () => {
      mockJobs.push(
        {
          jobId: "root",
          name: "Job",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
          attempt: 1,
          maxAttempts: 3,
        },
        {
          jobId: "child",
          name: "Job",
          status: "failed",
          parentJobId: "root",
          createdAt: new Date(),
          updatedAt: new Date(),
          attempt: 2,
          maxAttempts: 3,
        }
      );

      const chain = await getJobChain("child");

      expect(chain.length).toBe(2);
      expect(chain[0].jobId).toBe("root");
      expect(chain[1].jobId).toBe("child");
    });
  });
});
