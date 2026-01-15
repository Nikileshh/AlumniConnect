import Project from "../models/project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      problem,
      solution,
      valuationProposal,
      equityForSaleProposal
    } = req.body;

    // validate input
    if (!title || !problem || !solution || !valuationProposal || !equityForSaleProposal) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = await Project.create({
      title,
      problem,
      solution,
      valuationProposal,
      equityForSaleProposal,
      creator: req.user._id,
      status: "pending-approval"
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Fetch all visible projects (used by dashboard)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate("creator", "name email role")
      .populate("investors.investor", "name email role");

    res.json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// Investor invests in a project
export const investInProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { amount } = req.body;
    const investorId = req.user._id;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid investment amount" });
    }

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.status !== "open-for-funding") {
      return res.status(400).json({ message: "Project not open for funding" });
    }

    const contribution = Number(amount);

    // Equity allocation calculation
    const equityPerDollar = project.equityForSaleApproved / project.totalRaise;
    const allocatedEquity = equityPerDollar * contribution;

    // Record investment
    project.investors.push({
      investor: investorId,
      amount: contribution,
      equity: allocatedEquity
    });

    project.fundsRaised += contribution;

    // Check if funding goal reached
    if (project.fundsRaised >= project.totalRaise) {
      project.status = "funded";
    }

    await project.save();

    res.status(200).json({ message: "Investment successful" });
  } catch (error) {
    console.error("INVEST ERROR:", error);
    res.status(500).json({ message: "Failed to invest" });
  }
};
