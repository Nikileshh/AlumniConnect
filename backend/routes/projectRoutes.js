import express from "express";
import {
  createProject,
  getAllProjects,
  investInProject
} from "../controllers/projectController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// STUDENT: submit project proposal
router.post("/create", protect, createProject);

// DASHBOARD: fetch all projects for role-based filtering
router.get("/all", protect, getAllProjects);

// INVESTOR: invest in open-for-funding project
router.post("/invest/:id", protect, investInProject);

export default router;
