import Project from "../models/Project.js";

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load projects" });
  }
};

export const getMarketplaceProjects = async (req, res) => {
  try {
    const user = req.user;

    // ADMIN sees all
    if (user.role === "admin") {
      const all = await Project.find({
        status: { $in: ["approved", "open-for-funding"] }
      })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

      return res.json(all);
    }

    // ALUMNI + STUDENT-INVESTOR
    if (user.role === "alumni" || user.canInvest) {
      const investables = await Project.find({
        status: { $in: ["approved", "open-for-funding"] }
      })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

      return res.json(investables);
    }

    // DEFAULT STUDENT (not investor)
    return res.status(403).json({ message: "Enable investor mode to view marketplace" });
  } catch (err) {
    res.status(500).json({ message: "Failed to load marketplace" });
  }
};

export const getCompletedProjects = async (req, res) => {
  try {
    const completed = await Project.find({
      status: "funded"
    })
      .populate("createdBy", "name")
      .sort({ updatedAt: -1 });

    return res.json(completed);
  } catch (err) {
    res.status(500).json({ message: "Failed to load completed projects" });
  }
};
