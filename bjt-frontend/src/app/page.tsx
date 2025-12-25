// src/app/page.tsx
import CreateJobForm from "@/jobs/CreateJobForm";
import JobList from "@/jobs/JobList";

export default function Page() {
  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">Job Tracker</h1>
      <CreateJobForm />
      <JobList />
    </main>
  );
}
