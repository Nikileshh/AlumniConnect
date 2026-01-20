import { useEffect, useState } from "react";
import API from "../services/api";

export default function Marketplace() {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      const res = await API.get("/projects/marketplace");
      setProjects(res.data);
    };
    load();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Marketplace</h2>

      {projects.length === 0 && <p>No active fundraising projects</p>}

      {projects.map(project => (
        <div key={project._id} style={{ border: "1px solid #ccc", padding: 20, marginBottom: 15 }}>
          <h3>{project.title}</h3>
          <p>{project.problem}</p>
          <p>Target: ₹{project.totalRaise}</p>
          <p>Raised: ₹{project.fundsRaised}</p>

          {user._id !== project.createdBy._id && (
            <button onClick={() => alert("Invest flow later")}>
              Invest
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
