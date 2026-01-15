import { useState } from "react";
import API from "../services/api";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [valuationProposal, setValuationProposal] = useState("");
  const [equityProposal, setEquityProposal] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !problem || !solution || !valuationProposal || !equityProposal) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post(
        "/projects/create",
        {
          title,
          problem,
          solution,
          valuationProposal: Number(valuationProposal),
          equityForSaleProposal: Number(equityProposal),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Project submitted for admin approval!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Failed to submit project");
    }
  };

  // prevent admins from accessing creation page
  if (user.role === "admin") {
    return <p>Admins cannot create projects.</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create Project Proposal</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "400px" }}>
        
        <label>Project Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Problem</label>
        <textarea value={problem} onChange={(e) => setProblem(e.target.value)} />

        <label>Solution</label>
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} />

        <label>Proposed Valuation (₹)</label>
        <input
          type="number"
          value={valuationProposal}
          onChange={(e) => setValuationProposal(e.target.value)}
        />

        <label>Equity Offered (%)</label>
        <input
          type="number"
          value={equityProposal}
          onChange={(e) => setEquityProposal(e.target.value)}
        />

        <button type="submit" style={{ marginTop: "20px" }}>
          Submit for Approval
        </button>
      </form>
    </div>
  );
}
