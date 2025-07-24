import { useEffect, useState } from "react";
import { getJobs, createJob, deleteJob, updateJob } from "./api";

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "Applied",
    date_applied: "",
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editForm, setEditForm] = useState({});

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
        setForm({ company: "", position: "", status: "Applied", date_applied: "" });
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

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    setEditForm({ ...job });
  };
  
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const updated = await updateJob(editForm.id, editForm);
      setJobs(jobs.map((job) => (job.id === updated.id ? updated : job)));
      setEditingJobId(null);
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to save changes.");
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
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="date"
          name="date_applied"
          value={form.date_applied}
          onChange={handleChange}
          style={{ marginRight: "1rem" }}
        />
        <button type="submit">Add Job</button>
      </form>

      {/* Job Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Date Applied</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <tr key={job.id}>
                {editingJobId === job.id ? (
                  <>
                    <td>
                      <input
                        name="company"
                        value={editForm.company}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="position"
                        value={editForm.position}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date_applied"
                        value={editForm.date_applied?.slice(0, 10)}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleEditSave}>Save</button>
                      <button onClick={() => setEditingJobId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{job.company}</td>
                    <td>{job.position}</td>
                    <td>{job.status}</td>
                    <td>
                      {job.date_applied
                        ? new Date(job.date_applied).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(job)}>Edit</button>
                      <button onClick={() => handleDelete(job.id)} style={{ color: "red" }}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No jobs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
