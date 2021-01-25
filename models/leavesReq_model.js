const mongoose = require("mongoose");
const leavesReqSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  dateTo: {
    type: Date,
  },

  type: {
    type: String,
    uppercase: true,
    enum: ["ANNUAL", "MATERNITY", "SICK", "ACCIDENTAL", "COMPENSATION"],
    required: true,
  },

  reason: {
    type: String,
  },

  status: {
    type: String,
    uppercase: true,
    enum: ["ACCEPTED", "REJECTED", "PENDING"],
    default: "PENDING",
  },

  canceled: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model("LeaveRequests", leavesReqSchema);
