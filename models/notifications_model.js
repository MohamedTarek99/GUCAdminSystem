const mongoose = require("mongoose");
const notificationsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notifications", notificationsSchema);
