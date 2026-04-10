import Leave from "../models/Leave.js";
import User from "../models/User.js";

const calcDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
};

// POST /api/leaves — Employee applies leave
export const applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Type, start and end dates are required." });
    }

    if (endDate < startDate) {
      return res.status(400).json({ success: false, message: "End date must be after start date." });
    }

    const totalDays = calcDays(startDate, endDate);
    const user = await User.findById(req.user._id);

    if (totalDays > user.leaveBalance) {
      return res.status(400).json({ success: false, message: `Insufficient leave balance. Available: ${user.leaveBalance} days.` });
    }

    const leave = await Leave.create({
      userId: req.user._id,
      type,
      startDate,
      endDate,
      totalDays,
      reason: reason || "",
    });

    res.status(201).json({ success: true, message: "Leave request submitted.", leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leaves/my — Employee's own leaves
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/leaves/:id/cancel — Employee cancels pending leave
export const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({ _id: req.params.id, userId: req.user._id });

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found." });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending leaves can be cancelled." });
    }

    leave.status = "Rejected";
    await leave.save();

    res.status(200).json({ success: true, message: "Leave cancelled.", leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leaves/all — Admin: all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/leaves/:id/decide — Admin approve/reject
export const decideLeave = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Approved or Rejected." });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found." });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Leave already decided." });
    }

    leave.status = status;
    await leave.save();

    // Deduct balance on approval
    if (status === "Approved") {
      await User.findByIdAndUpdate(leave.userId, {
        $inc: { leaveBalance: -leave.totalDays },
      });
    }

    res.status(200).json({ success: true, message: `Leave ${status.toLowerCase()}.`, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
