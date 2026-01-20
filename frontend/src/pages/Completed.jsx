import { useEffect, useState } from "react";
import API from "../services/api";

export default function Completed() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await API.get("/projects/completed");
      setProjects(res.data);
    };
    load();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Completed Projects</h2>

      {projects.length === 0 && <p>No funded projects yet</p>}

      {projects.map(project => (
        <div key={project._id} style={{ border: "1px solid #ccc", padding: 20, marginBottom: 15 }}>
          <h3>{project.title}</h3>
          <p>Raised: ₹{project.fundsRaised}</p>
          <p>Status: Funded</p>
        </div>
      ))}
    </div>
  );
}
