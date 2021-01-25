const express = require("express");
const router = express.Router();
require("dotenv").config();

const user_model = require("../models/user_model");
const slot_model = require("../models/slots_model");
const CDOReq_model = require("../models/changeDayOffReq_model");
const SLReq_model = require("../models/slotLinkingReq_model");
const leavesReq_model = require("../models/leavesReq_model");
const repReq_model = require("../models/replacementReq_model");
const notif_model = require("../models/notifications_model");
const attendnace_model = require("../models/attendance_model");
const leaves_model = require("../models/leaves_model");
const courses_model = require("../models/courses_model");

function getRangeDates() {
  const currentdate = new Date();
  const currentyear = currentdate.getFullYear();

  const currentday = currentdate.getDate();
  const currentmonth = currentdate.getMonth();
  let startingyear = 0;
  let startingmonth = 0;
  let startingday = 11;
  let endingyear = 0;
  let endingmonth = 0;
  let endingday = 10;
  if (currentday >= 11) {
    startingyear = currentyear;
    startingmonth = currentmonth;
    if (startingmonth === 11) {
      endingmonth = 0;
      endingyear = currentyear + 1;
    } else {
      endingmonth = currentmonth + 1;
      endingyear = currentyear;
    }
  } else {
    endingmonth = currentmonth;
    endingyear = currentyear;
    if (endingmonth === 0) {
      startingmonth = 11;
      startingyear = currentyear - 1;
    } else {
      startingmonth = currentmonth - 1;
      startingyear = currentyear;
    }
  }
  const result = {
    from: new Date(startingyear, startingmonth, startingday, 2, 0, 0),
    to: new Date(endingyear, endingmonth, endingday, 2, 0, 0),
  };
  return result;
}

router
  .route("/viewSchedule")

  .get(async (req, res) => {
    if (req.user.role !== "HR") {
      const id = req.user.id;
      const slots = await slot_model.find({
        instructor: id,
      });
      if (slots) {
        res.send(slots);
      } else {
        res.status(404).send("There is no schedule for current user");
      }
    } else {
      return res.send("access denied");
    }
  });
router
  .route("/viewSlotById")

  .post(async (req, res) => {
    if (req.user.role !== "HR") {
      const id = req.body.id;
      const slots = await slot_model.findOne({
        _id: id,
      });
      if (slots) {
        res.send(slots);
      } else {
        res.send("There is no such slot");
      }
    } else {
      return res.send("access denied");
    }
  });

router
  .route("/viewAvailableSlotsByCourse")

  .post(async (req, res) => {
    if (req.user.role !== "HR") {
      const thisCourse = req.body.course;
      const slots = await slot_model.find({
        instructor: null,
        course: thisCourse,
      });
      if (slots) {
        res.send(slots);
      } else {
        res.send("There are no available slots for the chosen course");
      }
    } else {
      return res.send("access denied");
    }
  });

router.route("/getInstructorCourses").get(async (req, res) => {
  console.log(req.user.id);
  const courses = await courses_model.find(
    { instructors: req.user.id },
    { id: 1, _id: 1 }
  );
  console.log(courses);
  res.send(courses);
});

router.route("/sendReplacementRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    const request = new repReq_model({
      senderId: req.user.id,
      recipientId: req.body.recipientId,
      slotID: req.body.slotID,
    });

    try {
      await request.save();
      return res.send("Request sent succesfully!");
    } catch (error) {
      console.log(error);
      return res.send("invalid entry");
    }
  } else {
    return res.send("access denied");
  }
});

router.route("/viewReplacementRequest").get(async (req, res) => {
  if (req.user.role !== "HR") {
    const id = req.user.id;
    const requests = await repReq_model.find({
      $or: [
        {
          senderId: id,
        },
        {
          recipientId: id,
        },
      ],
    });
    return res.send(requests);
  } else {
    return res.send("access denied");
  }
});

router.route("/acceptReplacementRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    const reqId = req.body.reqId;
    await repReq_model.findByIdAndUpdate(
      {
        _id: reqId,
      },
      {
        status: "ACCEPTED",
      },
      async function (err, result) {
        if (err) {
          res.send("request doesnt exist");
        } else {
          console.log(result);
          const notification = new notif_model({
            userId: result.senderId,
            message: `Your replacement request with ${result.recipientId} has been accepted!`,
          });

          try {
            await notification.save();
            return res.send("request accepted");
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  } else {
    return res.send("access denied");
  }
});

router.route("/rejectReplacementRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    const reqId = req.body.reqId;
    await repReq_model.findByIdAndUpdate(
      {
        _id: reqId,
      },
      {
        status: "REJECTED",
      },
      async function (err, result) {
        if (err) {
          res.send("request doesnt exist");
        } else {
          const notification = new notif_model({
            userId: result.senderId,
            message: `Your replacement request with ${result.recipientId} has been rejected!`,
          });

          try {
            await notification.save();
            return res.send("request rejected");
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  } else {
    return res.send("access denied");
  }
});

router.route("/sendSlotLinkingRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    const request = new SLReq_model({
      senderId: req.user.id,
      slotID: req.body.slotID,
      course: req.body.course,
    });

    try {
      await request.save();
      return res.send("request sent");
    } catch (error) {
      console.log(error);
      res.send("invalid entry");
    }
  } else {
    return res.send("access denied");
  }
});

router.route("/sendChangeDayOffRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    const currUser = await user_model.findOne({
      id: req.user.id,
    });
    const currDay = currUser.dayoff;
    const day = req.body.day;
    if (currDay === day) return res.send("This is your day off already");
    const request = new CDOReq_model({
      senderId: req.user.id,
      reqDay: day,
      reason: req.body.reason,
    });

    try {
      await request.save();
      return res.send("request sent");
    } catch (error) {
      console.log(error);
      res.send("invalid entry");
    }
  } else {
    return res.send("access denied");
  }
});

router.route("/sendLeaveRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    let thisDateTo;
    const thisType = req.body.type;

    const thisDate = new Date(
      req.body.year,
      req.body.month - 1,
      req.body.day,
      2,
      0,
      0
    );
    if (req.body.yearTo && thisType === "COMPENSATION") {
      thisDateTo = new Date(
        req.body.yearTo,
        req.body.monthTo - 1,
        req.body.dayTo,
        2,
        0,
        0
      );
    } else {
      thisDateTo = null;
    }
    const today = new Date();
    today.setHours(2);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const thisReason = req.body.reason;
    const thisUser = await user_model.findOne({
      id: req.user.id,
    });

    if (thisType === "COMPENSATION") {
      if (!thisReason) return res.send("Enter Reason");
      if (!thisDateTo) return res.send("Enter the day you attended");

      const acceptedRange = getRangeDates();
      let valid1 =
        thisDateTo.getTime() >= acceptedRange.from.getTime() &&
        thisDateTo.getTime() <= acceptedRange.to.getTime();
      let valid2 =
        thisDate.getTime() >= acceptedRange.from.getTime() &&
        thisDate.getTime() <= acceptedRange.to.getTime();
      console.log(thisDateTo);
      console.log(thisDate);
      if (!(thisDateTo.getTime() > thisDate.getTime()))
        return res.send("invalid date entry");

      if (!(valid1 && valid2)) return res.send("Compensation period exceeded");

      const userDayOFF = thisUser.dayoff;
      console.log(userDayOFF);
      const thisDayOFF = thisDateTo.getDay();
      console.log(thisDayOFF);

      switch (thisDayOFF) {
        case 6:
          if (userDayOFF !== "Saturday")
            return res.send("This is not your day off");
          break;
        case 0:
          if (userDayOFF !== "Sunday")
            return res.send("This is not your day off");
          break;
        case 1:
          if (userDayOFF !== "Monday")
            return res.send("This is not your day off");
          break;
        case 2:
          if (userDayOFF !== "Tuesday")
            return res.send("This is not your day off");
          break;
        case 3:
          if (userDayOFF !== "Wednesday")
            return res.send("This is not your day off");
          break;
        case 4:
          if (userDayOFF !== "Thursday")
            return res.send("This is not your day off");
          break;
        default:
          break;
      }

      const attendanceRecord = await attendnace_model.findOne({
        $and: [
          {
            id: req.user.id,
          },
          {
            date: thisDateTo,
          },
        ],
      });
      if (!attendanceRecord || !attendanceRecord.hours > 0) {
        return res.send("You didn't attend this day");
      }
    }
    if (thisType === "MATERNITY" && thisUser.gender !== "Female") {
      return res.send("Can't submit this request");
    }
    if (thisType === "ANNUAL") {
      if (!thisUser.annualleavesBalance > 0) {
        console.log(thisUser);
        return res.send("you have no more annual leaves balance");
      }
      if (today.getDate() > thisDate.getDate())
        return res.send("Can't submit this request");
    }
    if (thisType === "ACCIDENTAL") {
      if (!thisUser.annualleavesBalance > 0) {
        return res.send("you have no more annual leaves balance");
      }
      if (!thisUser.accidentalLeavesBalance > 0) {
        return res.send("you have no more accidental leaves balance");
      }
    }
    if (thisType === "SICK") {
      var validDate = new Date(thisDate);
      validDate.setDate(thisDate.getDate() + 3);

      console.log(today);
      console.log(validDate);
      console.log(thisDate);
      const valid =
        today.getTime() <= validDate.getTime() &&
        today.getTime() >= thisDate.getTime();
      if (!valid) {
        return res.send("invalid dates");
      }
    }

    const request = new leavesReq_model({
      senderId: req.user.id,
      dateTo: thisDateTo,
      date: thisDate,
      reason: thisReason,
      type: thisType,
    });

    try {
      await request.save();
      return res.send("request sent");
    } catch (error) {
      console.log(error);
      res.send("invalid entry");
    }
  } else {
    return res.send("access denied");
  }
});

router
  .route("/viewSubmittedRequests")

  .get(async (req, res) => {
    if (req.user.role !== "HR") {
      const id = req.user.id;
      const leaveRequests = await leavesReq_model.find({
        senderId: id,
      });
      const slotLinkingRequests = await SLReq_model.find({
        senderId: id,
      });
      const changeDayOffRequests = await CDOReq_model.find({
        senderId: id,
      });
      const replacementRequests = await repReq_model.find({
        senderId: id,
      });
      res.send({
        leaveRequests,
        slotLinkingRequests,
        changeDayOffRequests,
        replacementRequests,
      });
    } else {
      return res.send("access denied");
    }
  });

router
  .route("/viewRequestByID")

  .post(async (req, res) => {
    if (req.user.role !== "HR") {
      const id = req.body.id;
      const type = req.body.type;
      let request;
      switch (type) {
        case "LEAVE":
          request = await leavesReq_model.findOne({
            _id: id,
          });
          break;
        case "SLOTLINKING":
          request = await SLReq_model.findOne({
            _id: id,
          });
          break;
        case "CHANGEDAYOFF":
          request = await CDOReq_model.findOne({
            _id: id,
          });
          break;
        case "REPLACEMENT":
          request = await repReq_model.findOne({
            _id: id,
          });
          break;
        default:
      }

      res.send({
        request,
      });
    } else {
      return res.send("access denied");
    }
  });

router
  .route("/viewPendingRequests")

  .get(async (req, res) => {
    if (req.user.role !== "HR") {
      const id = req.user.id;
      const leaveRequests = await leavesReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "PENDING",
          },
        ],
      });
      const slotLinkingRequests = await SLReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "PENDING",
          },
        ],
      });
      const changeDayOffRequests = await CDOReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "PENDING",
          },
        ],
      });
      const replacementRequests = await repReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "PENDING",
          },
        ],
      });
      res.send({
        leaveRequests,
        slotLinkingRequests,
        changeDayOffRequests,
        replacementRequests,
      });
    } else {
      return res.send("access denied");
    }
  });

router
  .route("/viewAcceptedRequests")

  .get(async (req, res) => {
    if (req.user.role !== "HR") {
      const id = req.user.id;
      const leaveRequests = await leavesReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "ACCEPTED",
          },
        ],
      });
      const slotLinkingRequests = await SLReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "ACCEPTED",
          },
        ],
      });
      const changeDayOffRequests = await CDOReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "ACCEPTED",
          },
        ],
      });
      const replacementRequests = await repReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "ACCEPTED",
          },
        ],
      });
      res.send({
        leaveRequests,
        slotLinkingRequests,
        changeDayOffRequests,
        replacementRequests,
      });
    } else {
      return res.send("access denied");
    }
  });

router
  .route("/viewRejectedRequests")

  .get(async (req, res) => {
    if (req.user.role !== "HR") {
      const id = req.user.id;
      const leaveRequests = await leavesReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "REJECTED",
          },
        ],
      });
      const slotLinkingRequests = await SLReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "REJECTED",
          },
        ],
      });
      const changeDayOffRequests = await CDOReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "REJECTED",
          },
        ],
      });
      const replacementRequests = await repReq_model.find({
        $and: [
          {
            senderId: id,
          },
          {
            status: "REJECTED",
          },
        ],
      });
      res.send({
        leaveRequests,
        slotLinkingRequests,
        changeDayOffRequests,
        replacementRequests,
      });
    } else {
      return res.send("access denied");
    }
  });

router.route("/cancelPendingRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    let canceledReq;
    const reqId = req.body.reqId;
    const reqType = req.body.type;
    switch (reqType) {
      case "REPLACEMENT":
        canceledReq = await repReq_model.findOne({
          _id: reqId,
        });
        if (canceledReq) {
          canceledReq.canceled = true;
          try {
            await canceledReq.save();
            res.send("request canceled");
          } catch (error) {
            console.log(error);
          }
        } else {
          res.send("request doesn't exist");
        }
        break;
      case "SLOTLINKING":
        canceledReq = await SLReq_model.findOne({
          _id: reqId,
        });
        if (canceledReq) {
          canceledReq.canceled = true;
          try {
            await canceledReq.save();
            res.send("request canceled");
          } catch (error) {
            console.log(error);
          }
        } else {
          res.send("request doesn't exist");
        }
        break;
      case "CHANGEDAYOFF":
        canceledReq = await CDOReq_model.findOne({
          _id: reqId,
        });
        if (canceledReq) {
          canceledReq.canceled = true;
          try {
            await canceledReq.save();
            res.send("request canceled");
          } catch (error) {
            console.log(error);
          }
        } else {
          res.send("request doesn't exist");
        }
        break;
      case "LEAVE":
        canceledReq = await leavesReq_model.findOne({
          _id: reqId,
        });
        if (canceledReq) {
          canceledReq.canceled = true;
          try {
            await canceledReq.save();
            res.send("request canceled");
          } catch (error) {
            console.log(error);
          }
        } else {
          res.send("request doesn't exist");
        }
        break;
      default:
        res.send("..");
    }
  } else {
    return res.send("access denied");
  }
});

router.route("/cancelUpComingRequest").post(async (req, res) => {
  if (req.user.role !== "HR") {
    let canceledReq;

    const reqId = req.body.reqId;
    const reqType = req.body.type;
    const today = new Date();
    today.setHours(2);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    switch (reqType) {
      case "SLOTLINKING":
        canceledReq = await SLReq_model.findOne({
          _id: reqId,
        });
        if (canceledReq) {
          const slotId = canceledReq.slotID;
          const slot = await slot_model.findOne({
            _id: slotId,
          });
          if (today.getTime() < slot.date.getTime()) {
            canceledReq.canceled = true;
            slot.instructor = null;
            try {
              await canceledReq.save();
              try {
                await slot.save();
              } catch (error) {
                console.log(error);
              }
              res.send("request canceled");
            } catch (error) {
              console.log(error);
            }
          } else {
            res.send("request can't be canceled anymore");
          }
        } else {
          res.send("request doesn't exist");
        }
        break;

      case "LEAVE":
        canceledReq = await leavesReq_model.findOne({
          _id: reqId,
        });
        const leaveType = canceledReq.type;
        if (leaveType !== "ANNUAL") {
          return res.send("can't cancel this request");
        }
        const reqDate = canceledReq.date;
        console.log("1");
        if (today.getTime() < reqDate.getTime()) {
          await leaves_model.findOneAndDelete({
            id: req.user.id,
            type: leaveType,
            date: reqDate,
          });
          console.log("1");

          canceledReq.canceled = true;
          try {
            await canceledReq.save();
            return res.send("request canceled");
          } catch {
            return res.send("Error");
          }
        } else {
          // console.log("1");

          return res.send("can't cancel this request anymore");
        }

      default:
        res.send(".invalid request type.");
    }
  } else {
    return res.send("access denied");
  }
});

module.exports = router;
