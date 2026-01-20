import express from "express";
import {
  getPendingProjects,
  approveProject,
  rejectProject
} from "../controllers/projectAdminController.js";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/admin0nly.js";

const router = express.Router();

// middleware: ensure user is admin
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

// GET pending proposals for approval
router.get("/pending", protect, adminOnly, getPendingProjects);

// APPROVE proposal (sets valuation, equity, opens funding)
router.patch("/:id/approve", protect, adminOnly, approveProject);

// REJECT proposal (sends reason & locks project)
router.patch("/:id/reject", protect, adminOnly, rejectProject);

export default router;
