const express = require("express");

const router = express.Router();

require("dotenv").config();

const notif_model = require("../models/notifications_model");

router.route("/notifications").get(async (req, res) => {
  if (req.user.role !== "HR") {
    const id = req.user.id;
    const notifications = await notif_model.find({
      userId: id,
    });
    return res.json(notifications);
  } else {
    return res.send("access denied");
  }
});
router.route("/notifications/:id/mark-as-seen").put(async (req, res) => {
  console.log(req.params);
  if (req.user.role !== "HR") {
    const notification = await notif_model.findOne({
      _id: req.params.id,
    });
    console.log(req.params.id, notification);
    if (notification) {
      notification.seen = true;
      notification.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } else {
    return res.send("access denied");
  }
});

module.exports = router;
