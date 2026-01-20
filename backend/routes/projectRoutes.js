import express from "express";
import protect from "../middleware/auth.js";
import {
  createProject,
  getMyProjects,
  getMarketplaceProjects,
  getCompletedProjects
} from "../controllers/projectController.js";


const router = express.Router();

// STUDENT: submit project proposal
router.post("/create", protect, createProject);

// INVESTOR: invest in open-for-funding project
router.post("/invest/:id", protect, investInProject);

router.get("/mine", protect, getMyProjects);
router.get("/marketplace", protect, getMarketplaceProjects);
router.get("/completed", protect, getCompletedProjects);

export default router;
