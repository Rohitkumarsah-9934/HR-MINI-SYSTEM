import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });

  if (!admin || admin.role !== "admin") {
    return res.status(401).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: admin._id,   //  MOST IMPORTANT
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
};