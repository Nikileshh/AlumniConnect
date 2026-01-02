import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects/all");

        let visibleProjects = [];

        if (user.role === "student") {
          // Student sees only their own projects
          visibleProjects = res.data.filter(
            (project) => project.createdBy?._id === user._id
          );
        } else {
          // Admin & Alumni see all projects
          visibleProjects = res.data;
        }

        setProjects(visibleProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <hr style={{ margin: "20px 0" }} />

      <h3>
        {user.role === "student"
          ? "My Projects"
          : "All Projects"}
      </h3>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h4>{project.title}</h4>

            <p><strong>Problem:</strong> {project.problem}</p>
            <p><strong>Funds Required:</strong> ₹{project.fundsRequired}</p>

            <p style={{ fontStyle: "italic" }}>
              Created by: {project.createdBy?.name}
            </p>

            {/* Alumni-only action */}
            {user.role === "alumni" && (
              <button style={{ marginTop: "10px" }}>
                Invest
              </button>
            )}
          </div>
        ))
      )}

      <br />

      {/* Student-only action */}
      {user.role === "student" && (
        <button onClick={() => window.location.href = "/create-project"}>
          Create New Project
        </button>
      )}
    </div>
  );
}
