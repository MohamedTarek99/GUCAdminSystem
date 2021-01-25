const mongoose = require("mongoose");
const slotLinkingSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },

  course: {
    type: String,
    required: true,
  },

  slotID: {
    type: String,
    required: true,
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
});
module.exports = mongoose.model("SlotLinkings", slotLinkingSchema);

 
