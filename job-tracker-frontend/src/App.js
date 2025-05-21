import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8080/jobs")
      .then(response => {
        console.log("Jobs fetched:", response.data); // ✅ Log response
        setJobs(response.data);
      })
      .catch(error => console.error("Error fetching jobs:", error));
  }, []);

  return (
    <div>
      <h1>Job Tracker</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <tr key={job.id}>
                <td>{job.company}</td>
                <td>{job.position}</td>
                <td>{job.status}</td>
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
