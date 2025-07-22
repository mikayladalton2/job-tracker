import { useEffect, useState } from "react";
import { getJobs, createJob, deleteJob, updateJobStatus } from "./api";

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "Applied"
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    getJobs()
      .then(setJobs)
      .catch((error) => console.error("Error fetching jobs:", error));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    createJob(form)
      .then((newJob) => {
        setJobs([...jobs, newJob]);
        setForm({ company: "", position: "", status: "Applied" });
      })
      .catch((error) => {
        console.error("Error creating job:", error);
        alert("Failed to add job.");
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
  
    try {
      await deleteJob(id); // <-- this calls the function from api.js
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedJob = await updateJobStatus(id, newStatus);
      setJobs(jobs.map(job => job.id === id ? updatedJob : job));
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job status.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Job Tracker</h1>

      {/* New Job Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          required
          style={{ marginRight: "1rem" }}
        />
        <input
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
          style={{ marginRight: "1rem" }}
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ marginRight: "1rem" }}
        >
          <option value="Applied">Applied</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit">Add Job</button>
      </form>

      {/* Job Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <tr key={job.id}>
                <td>{job.company}</td>
                <td>{job.position}</td>
                <td>
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(job.id)} style={{ color: "red" }}>
                    Delete
                </button>
        </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No jobs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
