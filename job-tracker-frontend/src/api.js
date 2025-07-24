import axios from "axios";

const API_BASE = "http://127.0.0.1:8080";

export async function getJobs() {
  const res = await axios.get(`${API_BASE}/jobs`);
  return res.data;
}

export async function createJob(jobData) {
  const res = await axios.post(`${API_BASE}/jobs`, jobData);
  return res.data;
}

export async function deleteJob(id) {
  const res = await axios.delete(`${API_BASE}/jobs/${id}`);
  return res.data;
}

export async function updateJobStatus(id, status) {
  const res = await axios.put(`${API_BASE}/jobs/${id}`, {
    status: status,
  });
  return res.data;
}

export async function updateJob(id, jobData) {
  const res = await axios.put(`${API_BASE}/jobs/${id}`, jobData);
  return res.data;
}
