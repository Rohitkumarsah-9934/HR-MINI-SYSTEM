import User from "../models/User.js";

// GET /api/users/employees — Admin: all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.status(200).json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
