import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/adminmiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);

router.get("/dashboard", protect, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;