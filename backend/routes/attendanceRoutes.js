import express from "express";
import {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/mark", protect, markAttendance);
router.get("/my", protect, getMyAttendance);
router.get("/all", protect, adminOnly, getAllAttendance);

export default router;
