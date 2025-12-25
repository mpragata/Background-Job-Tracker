// src/app/jobs/CreateJobForm.tsx
"use client";
import { useState } from "react";
import { createJob } from "../lib/api";

export default function CreateJobForm() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await createJob(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Job name"
        className="border p-2 flex-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Create
      </button>
    </form>
  );
}
