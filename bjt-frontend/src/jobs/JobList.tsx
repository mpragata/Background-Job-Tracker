// src/app/jobs/JobList.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchJobs } from "../lib/api";
import { Job } from "../types/types";
import JobItem from "./JobItem";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const loadJobs = async () => {
    const data = await fetchJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  const getJobChain = (job: Job) => {
    const rootJobId = job.parentJobId || job.jobId;

    return jobs
      .filter((j) => j.jobId === rootJobId || j.parentJobId === rootJobId)
      .sort((a, b) => (b.attempt || 1) - (a.attempt || 1));
  };

  return (
    <div>
      {jobs.map((job) => (
        <JobItem
          key={job.jobId}
          job={job}
          chain={getJobChain(job)}
          onRetry={loadJobs}
        />
      ))}
    </div>
  );
}
