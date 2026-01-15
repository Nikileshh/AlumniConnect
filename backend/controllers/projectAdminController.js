import Project from "../models/project.js";

// ADMIN: Fetch all pending projects
export const getPendingProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "pending-approval" })
      .populate("creator", "name email role");

    res.json(projects);
  } catch (error) {
    console.error("GET PENDING PROJECTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pending projects" });
  }
};

// ADMIN: Approve proposal + set approved valuation/equity
export const approveProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { valuationApproved, equityForSaleApproved } = req.body;

    if (!valuationApproved || !equityForSaleApproved) {
      return res.status(400).json({ message: "Missing approved valuation or equity" });
    }

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    project.valuationApproved = valuationApproved;
    project.equityForSaleApproved = equityForSaleApproved;

    // compute required raise based on % equity
    project.totalRaise = (valuationApproved * equityForSaleApproved) / 100;

    project.status = "open-for-funding";

    await project.save();

    res.status(200).json({ message: "Project approved and funding opened" });
  } catch (error) {
    console.error("APPROVE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to approve project" });
  }
};

// ADMIN: Reject proposal
export const rejectProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { reason } = req.body;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = "rejected";
    project.rejectionReason = reason || "No reason provided";

    await project.save();

    res.status(200).json({ message: "Project rejected" });
  } catch (error) {
    console.error("REJECT PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to reject project" });
  }
};
