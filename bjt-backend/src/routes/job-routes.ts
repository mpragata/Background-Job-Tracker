/**
 * job-routes.ts
 *
 * Routes for creating, get jobs, get single job, retry, and get record chain using services
 *
 */
import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getJob,
  getJobChain,
  retryJob,
} from "../services/job.service";

const router = Router();

// create job
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Job name required" });

  const job = await createJob(name);
  res.status(201).json(job);
});

// get 1 job
router.get("/:id", async (req, res) => {
  const job = await getJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// get all jobs
router.get("/", async (_req, res) => {
  res.json(await getAllJobs());
});

// retry job
router.post("/:id/retry", async (req, res) => {
  try {
    const job = await retryJob(req.params.id);
    res.status(201).json(job);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// get job chain
router.get("/:id/chain", async (req, res) => {
  try {
    const chain = await getJobChain(req.params.id);
    res.json(chain);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
