const user_model = require("../models/user_model");
const slot_model = require("../models/slots_model");
const courses_model = require("../models/courses_model");
const slotLinkingReq_model = require("../models/slotLinkingReq_model");
const room_model = require("../models/room_model");
// const notofications_model = require("../models/notifications_model");

const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const attendance_model = require("../models/attendance_model");
const notifications_model = require("../models/notifications_model");
const slots_model = require("../models/slots_model");
// const { findOneAndUpdate } = require("../models/user_model");
require("dotenv").config();

router.route("/getSlotLinkingRequests").get(async (req, res) => {
  const id = req.user.id;
  const course = await courses_model.findOne({ coordinator: id });
  console.log(course);
  const requests = await slotLinkingReq_model.find({
    course: course.id,
    status: "PENDING",
  });
  console.log(requests);
  const result = [];
  for (let index = 0; index < requests.length; index++) {
    const element = requests[index];
    const slot = await slot_model.findOne({ _id: element.slotID });
    const user = await user_model.findOne({ id: element.senderId });
    const merge = {
      id: element.senderId,
      name: user.name,
      date: slot.date,
      course: course.id,
      requestId: element._id,
    };
    result.push(merge);
  }
  res.send(result);
});

router.route("/acceptSlotLinkingRequest").post(async (req, res) => {
  try {
    const accepted = await slotLinkingReq_model.findOneAndUpdate(
      { _id: req.body.id },
      { status: "ACCEPTED" }
    );
    if (accepted) {
      const done = await slot_model.findOneAndUpdate(
        { _id: accepted.slotID },
        { instructor: accepted.senderId }
      );
      if (done) {
        res.send("request succesfully accepted");
        const newnotifciation = new notifications_model({
          userId: accepted.senderId,
          message: `Your slot linking request for slot ${accepted.slotID} has been accepted by ${req.user.id}!`,
        });
        newnotifciation.save();
      } else {
        res.send("Slot not found");
      }
    }
  } catch {
    res.send("An error has occured");
  }
});

router.route("/rejectSlotLinkingRequest").post(async (req, res) => {
  try {
    const accepted = await slotLinkingReq_model.findOneAndUpdate(
      { _id: req.body.id },
      { status: "REJECTED" }
    );
    if (accepted) {
      res.send("request rejected succesfully");
      const newnotifciation = new notifications_model({
        userId: accepted.senderId,
        message: `Your slot linking request for slot ${accepted.slotID} has been rejected by ${req.user.id}!`,
      });
      newnotifciation.save();
    } else {
      res.send("Could not cancel the request");
    }
  } catch {
    res.send("An error has occured");
  }
});

router.route("/viewCoordinatorSlots").get(async (req, res) => {
  // try{
  const id = req.user.id;
  const course = await courses_model.findOne({ coordinator: id });
  if (course == null) {
    return;
  }
  const resarray = [];
  const slots = await slots_model.find({ course: course.id });
  for (let j = 0; j < slots.length; j++) {
    const slot = slots[j];
    if (slot.instructor == null) {
      const res = {
        instructor: slot.instructor,
        _id: slot._id,
        date: slot.date,
        location: slot.location,
        course: slot.course,
      };
      resarray.push(res);
    } else {
      const AcademicName = await user_model.findOne({ id: slot.instructor });
      const res = {
        instructor: slot.instructor,
        _id: slot._id,
        date: slot.date,
        location: slot.location,
        course: slot.course,
        AcademicName: AcademicName.name,
      };

      resarray.push(res);
    }
  }
  res.send(resarray);
  //     }catch{
  //     res.send('An error has occured')
  // }
});
router.route("/addSlot").post(async (req, res) => {
  const course = await courses_model.findOne({ coordinator: req.user.id });
  console.log(course.coordinator);

  const location = await room_model.findOne({
    name: req.body.location,
    $or: [{ type: "Hall" }, { type: "Room" }, { type: "Lab" }],
  });
  if (!location) {
    res.send("Invalid Location");
    return;
  }

  const year = req.body.year;
  const month = req.body.month;
  const day = req.body.day;
  const time = req.body.time;
  const minutes = req.body.minutes;
  const date = new Date(year, month - 1, day, time + 2, minutes, 0, 0);
  const existingslot = await slot_model.findOne({
    date: date,
    location: req.body.location,
  });

  if (existingslot) {
    res.send("There exists a slot with the same timing and location!");
    return;
  }

  const newSlot = new slot_model({
    date: date,
    location: req.body.location,
    course: course.id,
  });
  try {
    await newSlot.save();
    res.send("Slot added");
  } catch {
    res.send("Error occured");
  }
});

router.route("/updateSlot").put(async (req, res) => {
  const slotID = req.body.slot;
  const locationID = req.body.location;
  // const slot = await slot_model.findOne({ _id: slotID });

  const location = await room_model.findOne({
    name: locationID,
    $or: [{ type: "Hall" }, { type: "Room" }, { type: "Lab" }],
  });
  if (!location) {
    return res.send("This location does not exist or its an office");
  }
  await slot_model.findOneAndUpdate({ _id: slotID }, { location: locationID });
  res.send("Location updated sucessfully");
});

router.route("/deleteSlot").put(async (req, res) => {
  const deleted = await slot_model.findOneAndDelete({ _id: req.body.id });
  if (deleted) {
    res.send("slot deleted succesfully");
  } else {
    res.send("could not delete slot!");
  }
});

module.exports = router;
