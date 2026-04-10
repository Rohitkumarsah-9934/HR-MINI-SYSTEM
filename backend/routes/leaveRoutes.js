import express from "express";
import {
  applyLeave,
  getMyLeaves,
  cancelLeave,
  getAllLeaves,
  decideLeave,
} from "../controllers/leaveController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, applyLeave);
router.get("/my", protect, getMyLeaves);
router.put("/:id/cancel", protect, cancelLeave);
router.get("/all", protect, adminOnly, getAllLeaves);
router.put("/:id/decide", protect, adminOnly, decideLeave);

export default router;
