// src/app/jobs/JobItem.tsx
"use client";
import { Job } from "../types/types";
import { retryJob } from "../lib/api";

interface Props {
  job: Job;
  chain: Job[];
  onRetry: () => void;
}

export default function JobItem({ job, chain, onRetry }: Props) {
  const canRetry =
    job.status === "failed" &&
    (job.attempt || 1) < (job.maxAttempts || 3) &&
    !chain
      .filter((j) => (j.attempt || 1) > (job.attempt || 1))
      .some((j) => j.status === "completed");

  return (
    <div className="border p-3 mb-3 rounded">
      {/* Job header */}
      <div className="flex justify-between items-center">
        <div>
          <strong>{job.name}</strong> ({job.status}) – Attempt {job.attempt}
        </div>

        {job.status === "failed" && (
          <button
            disabled={!canRetry}
            className={`px-2 py-1 text-white rounded ${
              canRetry
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={async () => {
              if (!canRetry) return;
              await retryJob(job.jobId);
              onRetry();
            }}
            title={
              !canRetry ? "Cannot retry: later attempt already succeeded" : ""
            }
          >
            Retry
          </button>
        )}
      </div>

      {/* Chain visualization */}
      <div className="mt-2 pl-2 border-l text-sm">
        {chain.map((c) => (
          <div key={c.jobId} className="flex items-center gap-2">
            <span>Attempt {c.attempt}</span>
            <span
              className={
                c.status === "completed"
                  ? "text-green-600"
                  : c.status === "failed"
                  ? "text-red-600"
                  : "text-gray-500"
              }
            >
              {c.status}
            </span>
            {c.jobId === job.jobId && (
              <span className="text-blue-600 text-xs ml-2 px-2 py-0.5 border rounded">
                This run
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
