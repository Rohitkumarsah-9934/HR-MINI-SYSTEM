import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// POST /api/attendance/mark
export const markAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const today = new Date().toISOString().split("T")[0];

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Present or Absent." });
    }

    const existing = await Attendance.findOne({ userId: req.user._id, date: today });
    if (existing) {
      return res.status(400).json({ success: false, message: "Attendance already marked for today." });
    }

    const attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      status,
    });

    res.status(201).json({ success: true, message: `Marked as ${status}.`, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/attendance/my
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/attendance/all — Admin
export const getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    const filter = {};
    if (employeeId) filter.userId = employeeId;
    if (date) filter.date = date;

    const records = await Attendance.find(filter)
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
