import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // ================================
  // FETCH PROJECTS FOR DASHBOARD
  // ================================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects/all", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ================================
  // FETCH PENDING PROJECTS (ADMIN ONLY)
  // ================================
  useEffect(() => {
    if (user.role !== "admin") return;

    const fetchPending = async () => {
      try {
        const res = await API.get("/admin/projects/pending", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPending(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPending();
  }, []);

  const toggleInvestorMode = async () => {
  try {
    const res = await API.patch("/users/toggle-investor");
    const updatedUser = { ...user, canInvest: res.data.canInvest };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.location.reload();
  } catch (err) {
    alert("Failed to toggle investor mode");
  }
  };

  // ================================
  // INVEST (INVESTORS ONLY)
  // ================================
  const handleInvest = async (projectId) => {
    const amount = prompt("Enter amount to invest:");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    try {
      await API.post(
        `/projects/invest/${projectId}`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Investment successful!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Investment failed");
    }
  };

  // ================================
  // ADMIN APPROVE
  // ================================
  const approve = async (id) => {
    const valuationApproved = prompt("Enter approved valuation (₹):");
    const equityApproved = prompt("Enter approved equity (%):");
    if (!valuationApproved || !equityApproved) return;

    try {
      await API.patch(
        `/admin/projects/${id}/approve`,
        {
          valuationApproved: Number(valuationApproved),
          equityForSaleApproved: Number(equityApproved)
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Project approved!");
      window.location.reload();
    } catch (err) {
      alert("Approval failed");
    }
  };

  // ================================
  // ADMIN REJECT
  // ================================
  const reject = async (id) => {
    const reason = prompt("Reason for rejection:");
    try {
      await API.patch(
        `/admin/projects/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Project rejected");
      window.location.reload();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>
      <p><strong>{user.name}</strong> ({user.role})</p>
      <hr />

      {/* STUDENT INVESTOR TOGGLE */}
      {user.role === "student" && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={toggleInvestorMode}>
            {user.canInvest ? "Deactivate Investor Mode" : "Activate Investor Mode"}
          </button>

          <p style={{ marginTop: "5px", fontSize: "14px" }}>
            Status: <strong>{user.canInvest ? "Investor Mode ON" : "Investor Mode OFF"}</strong>
          </p>
        </div>
      )}

      {/* ADMIN SECTION */}
      {user.role === "admin" && (
        <div>
          <h3>Pending Projects for Approval</h3>
          {pending.length === 0 ? <p>No pending projects</p> : pending.map(p => (
            <div key={p._id} style={styles.card}>
              <h4>{p.title}</h4>
              <p><strong>Valuation Proposed:</strong> ₹{p.valuationProposal}</p>
              <p><strong>Equity Proposed:</strong> {p.equityForSaleProposal}%</p>
              <p><em>By {p.creator?.name}</em></p>
              <button onClick={() => approve(p._id)}>Approve</button>
              <button style={{ marginLeft: 10 }} onClick={() => reject(p._id)}>Reject</button>
            </div>
          ))}
          <hr />
        </div>
      )}

      <h3>Projects</h3>
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map(project => (
          <div key={project._id} style={styles.card}>
            <h4>{project.title}</h4>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Valuation:</strong> {project.valuationApproved ? `₹${project.valuationApproved}` : "Pending"}</p>
            <p><strong>Equity Offered:</strong> {project.equityForSaleApproved ? `${project.equityForSaleApproved}%` : "Pending"}</p>
            {project.totalRaise && <p><strong>Target Raise:</strong> ₹{project.totalRaise}</p>}
            <p><strong>Funds Raised:</strong> ₹{project.fundsRaised}</p>

            {(user.role === "alumni" || user.canInvest) && project.status === "open-for-funding" && (
              <button onClick={() => handleInvest(project._id)}>
                Invest
              </button>
            )}

          </div>
        ))
      )}

      {/* STUDENT CREATE BUTTON */}
      {user.role === "student" && (
        <button style={{ marginTop: 20 }} onClick={() => (window.location.href = "/create-project")}>
          Create New Project
        </button>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "8px"
  }
};
