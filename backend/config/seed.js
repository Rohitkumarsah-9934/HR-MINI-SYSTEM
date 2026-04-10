import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "./db.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: "admin@hrms.com" });
  if (adminExists) {
    console.log("✅ Admin already seeded.");
    process.exit(0);
  }

  await User.create({
    name: "Admin User",
    email: "admin@hrms.com",
    password: "admin123",
    role: "admin",
    joinDate: "2024-01-01",
    leaveBalance: 0,
  });

  console.log("✅ Admin seeded: admin@hrms.com / admin123");
  process.exit(0);
};

seed();
