import express from "express";
import { getAllEmployees, getProfile } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/employees", protect, adminOnly, getAllEmployees);

export default router;
