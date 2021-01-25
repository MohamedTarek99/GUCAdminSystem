const user_model = require("../models/user_model");
const slot_model = require("../models/slots_model");
const courses_model = require("../models/courses_model");
const leavesReq_model = require("../models/leavesReq_model");
const changeDayOffReq_model = require("../models/changeDayOffReq_model");
const leaves_model = require("../models/leaves_model");
const notifications_model = require("../models/notifications_model");

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Console } = require("console");
require("dotenv").config();

router.route("/assign").post(async (req, res) => {
  //instructor id & course id
  try {
    //HOD info
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    // Instructor info
    const InstructorID = req.body.id;
    const Instructor = await user_model.findOne({ id: InstructorID });

    //Course info
    const CourseID = req.body.courseId;
    const Course = await courses_model.findOne({ id: CourseID });
    if (Instructor && Course) {
      const InstructorRole = Instructor.role;
      const InstructorDep = Instructor.department;
      const CourseDep = Course.department;
      const CourseInsts = Course.instructors;
      const isInDB = CourseInsts.indexOf(InstructorID);

      if (isInDB == -1) {
        if (HOD.role == "ACADEMIC MEMBER") {
          if (InstructorDep == HODdep && InstructorRole == "ACADEMIC MEMBER") {
            if (CourseDep == HODdep) {
              try {
                CourseInsts.push(InstructorID);
                await courses_model.updateOne(
                  { id: CourseID },
                  { instructors: CourseInsts }
                );
              } catch (error) {
                console.log("error");
              }
              // await courses_model.findOne({id: CourseID}).push(InstructorID);
            } else {
              return res.send(
                "This course does not belong to your department !!"
              );
            }
          } else if (
            InstructorDep == HODdep &&
            InstructorRole != "ACADEMIC MEMBER"
          ) {
            return res.send(
              "The id you entered does not belong to a ACADEMIC MEMBER !!"
            );
          } else if (
            InstructorDep != HODdep &&
            InstructorRole == "ACADEMIC MEMBER"
          ) {
            return res.send(
              "This instructor does not belong to your depatrment !!"
            );
          } else {
            return res.send(
              "The id you entered does not belong to a ACADEMIC MEMBER !!"
            );
          }
        } else {
          return res.send("This page can not be accessed !!");
        }
      } else {
        return res.send(
          "This Instructor has been already assigned to this course !!"
        );
      }
    } else if (Course) {
      return res.send("There is no Instructor with ID " + InstructorID + " !!");
    } else if (Instructor) {
      return res.send("There is no Course with ID " + CourseID + " !!");
    } else {
      return res.send("You entered wrong data !!");
    }
    return res.send(
      "You assigned " + Instructor.name + " to the course successfully"
    );
  } catch (error) {
    return res.send("Error !!");
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/delete").post(async (req, res) => {
  //instructor id & course id
  try {
    //HOD info
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    // Instructor info
    const InstructorID = req.body.id;
    const Instructor = await user_model.findOne({ id: InstructorID });

    //Course info
    const CourseID = req.body.courseId;
    const Course = await courses_model.findOne({ id: CourseID });
    if (Instructor && Course) {
      const InstructorRole = Instructor.role;
      const InstructorDep = Instructor.department;
      const CourseDep = Course.department;
      const CourseInsts = Course.instructors;
      const isInDB = CourseInsts.indexOf(InstructorID);

      if (isInDB > -1) {
        if (HOD.role == "ACADEMIC MEMBER") {
          if (InstructorDep == HODdep && InstructorRole == "ACADEMIC MEMBER") {
            if (CourseDep == HODdep) {
              try {
                await courses_model.updateOne(
                  { id: CourseID },
                  { $pullAll: { instructors: [InstructorID] } }
                );
              } catch (error) {
                console.log("error");
              }
              // await courses_model.findOne({id: CourseID}).push(InstructorID);
            } else {
              return res.send(
                "This course does not belong to your department !!"
              );
            }
          } else if (
            InstructorDep == HODdep &&
            InstructorRole != "ACADEMIC MEMBER"
          ) {
            return res.send(
              "The id you entered does not belong to a Instructor !!"
            );
          } else if (
            InstructorDep != HODdep &&
            InstructorRole == "ACADEMIC MEMBER"
          ) {
            return res.send(
              "This instructor does not belong to your depatrment !!"
            );
          } else {
            return res.send(
              "The id you entered does not belong to a Instructor !!"
            );
          }
        } else {
          return res.send("This page can not be accessed !!");
        }
      } else {
        return res.send("This Instructor does not teach this course !!");
      }
    } else if (Course) {
      return res.send("There is no Instructor with ID " + InstructorID + " !!");
    } else if (Instructor) {
      return res.send("There is no Course with ID " + CourseID + " !!");
    } else {
      return res.send("You entered wrong data !!");
    }
    return res.send(
      "You deleted " +
        Instructor.name +
        " from teaching course : (" +
        Course.id +
        ") successfully"
    );
  } catch (error) {
    return res.send("Error !!");
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router
  .route("/update")
  //instructor id & instructor id2 & course id
  .post(async (req, res) => {
    try {
      //HOD info

      const HODid = req.user.id;
      const HOD = await user_model.findOne({ id: HODid });
      const HODdep = HOD.department;
      // Instructor1 info
      const InstructorID = req.body.id;
      const Instructor = await user_model.findOne({ id: InstructorID });
      // Instructor2 info
      const InstructorID2 = req.body.id2;
      const Instructor2 = await user_model.findOne({ id: InstructorID2 });

      //Course info
      const CourseID = req.body.courseId;
      const Course = await courses_model.findOne({ id: CourseID });
      if (Instructor && Instructor2 && Course) {
        const InstructorRole = Instructor.role;
        const InstructorDep = Instructor.department;
        const InstructorRole2 = Instructor2.role;
        const InstructorDep2 = Instructor2.department;
        const CourseDep = Course.department;
        var CourseInsts = Course.instructors;
        const isInDB = CourseInsts.indexOf(InstructorID);

        if (isInDB > -1) {
          if (HOD.role == "ACADEMIC MEMBER") {
            if (
              InstructorDep == HODdep &&
              InstructorDep2 == HODdep &&
              InstructorRole == "ACADEMIC MEMBER" &&
              InstructorRole2 == "ACADEMIC MEMBER"
            ) {
              if (CourseDep == HODdep) {
                try {
                  const index = CourseInsts.indexOf(InstructorID);
                  if (index > -1) {
                    CourseInsts.splice(index, 1);
                  }
                  CourseInsts.push(InstructorID2);
                  await courses_model.updateOne(
                    { id: CourseID },
                    { instructors: CourseInsts }
                  );
                } catch (error) {
                  console.log("error");
                }
                // await courses_model.findOne({id: CourseID}).push(InstructorID);
              } else {
                return res.send(
                  "This course does not belong to your department !!"
                );
              }
            } else if (
              InstructorDep2 == HODdep &&
              InstructorRole2 != "ACADEMIC MEMBER"
            ) {
              return res.send(
                "The id you entered does not belong to an Instructor !!"
              );
            } else if (
              InstructorDep2 != HODdep &&
              InstructorRole2 == "ACADEMIC MEMBER"
            ) {
              return res.send(
                "This instructor does not belong to your depatrment !!"
              );
            } else {
              return res.send(
                "Make sure you entered the id of a instructor that teach the same department !!"
              );
            }
          } else {
            return res.send("This page can not be accessed !!");
          }
        } else {
          return res.send("This Instructor does not teach this course !!");
        }
      } else if (Course && Instructor2) {
        return res.send(
          "There is no Instructor with ID " + InstructorID + " !!"
        );
      } else if (Instructor && Instructor2) {
        return res.send("There is no Course with ID " + CourseID + " !!");
      } else if (Course && Instructor) {
        return res.send(
          "There is no Instructor with ID " + InstructorID2 + " !!"
        );
      } else if (Course) {
        return res.send(
          "There is no Instructor with ID " +
            InstructorID +
            " !! \n There is no Instructor with ID " +
            InstructorID2 +
            " !!"
        );
      } else if (Instructor) {
        return res.send(
          "There is no Instructor with ID " +
            InstructorID2 +
            " !!" +
            "\n" +
            "There is no Course with ID " +
            CourseID +
            " !!"
        );
      } else if (Instructor2) {
        return res.send(
          "There is no Instructor with ID " +
            InstructorID +
            " !!" +
            "\n" +
            "There is no Course with ID " +
            CourseID +
            " !!"
        );
      } else {
        return res.send("You entered wrong data !!");
      }
      return res.send(
        "You updated " +
          Instructor.name +
          " with " +
          Instructor2.name +
          " to teach course : (" +
          Course.id +
          ") successfully"
      );
    } catch (error) {
      return res.send(error);
    }
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/ViewStaffInDep").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    const Staff = await user_model.find({ department: HODdep });
    if (HOD.role == "ACADEMIC MEMBER") {
      if (Staff.length > 0) {
        const users = await user_model.find({ department: HODdep });
        var final = [];

        for (let i = 0; i < users.length; i++) {
          final.push({
            ID: users[i].id,
            Name: users[i].name,
            Email: users[i].email,
            Role: users[i].role,
            Gender: users[i].gender,
            Faculty: users[i].Faculty,
            Department: users[i].department,
            Day_off: users[i].dayoff,
            Office: users[i].office,
          });
        }
        return res.send(final);
      } else {
        return res.send("There is no Staff in your department !!");
      }
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/ViewStaffInCourse").post(async (req, res) => {
  try {
    //   const HODid = req.user.id;
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    const Staff = await user_model.find({ department: HODdep });

    if (HOD.role == "ACADEMIC MEMBER") {
      const CourseID = req.body.courseid;

      const Course = await courses_model.findOne({ id: CourseID });
      const CourseCoordinator = Course.coordinator;
      const CourseIns = Course.instructors;
      const CourseTAs = Course.teachingAssistants;
      const CourseDep = Course.department;
      const Coordinator = await user_model.findOne({ id: CourseCoordinator });
      const Instructors = await user_model.find({ id: CourseIns });
      const TAs = await user_model.find({ id: CourseTAs });

      var final = [];
      if (CourseDep == HODdep) {
        final.push({
          ID: Coordinator.id,
          Name: Coordinator.name,
          Email: Coordinator.email,
          Role: Coordinator.role,
          Gender: Coordinator.gender,
          Faculty: Coordinator.Faculty,
          Department: Coordinator.department,
          Day_off: Coordinator.dayoff,
          Office: Coordinator.office,
        });

        for (let i = 0; i < Instructors.length; i++) {
          final.push({
            ID: Instructors[i].id,
            Name: Instructors[i].name,
            Email: Instructors[i].email,
            Role: Instructors[i].role,
            Gender: Instructors[i].gender,
            Faculty: Instructors[i].Faculty,
            Department: Instructors[i].department,
            Day_off: Instructors[i].dayoff,
            Office: Instructors[i].office,
          });
        }
        for (let i = 0; i < TAs.length; i++) {
          final.push({
            ID: TAs[i].id,
            Name: TAs[i].name,
            Email: TAs[i].email,
            Role: TAs[i].role,
            Gender: TAs[i].gender,
            Faculty: TAs[i].Faculty,
            Department: TAs[i].department,
            Day_off: TAs[i].dayoff,
            Office: TAs[i].office,
          });
        }

        return res.send(final);
      } else {
        return res.send("This course does not belong to your department");
      }
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/ViewDayOffAll").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    const Staff = await user_model.find({ department: HODdep });

    if (HOD.role == "ACADEMIC MEMBER") {
      const users = await user_model.find({ department: HODdep });
      var final = [];

      for (let i = 0; i < users.length; i++) {
        final.push({
          ID: users[i].id,
          Name: users[i].name,
          Day_off: users[i].dayoff,
        });
      }

      return res.send(final);
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/ViewDayOffByID").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    const StaffID = req.body.id;
    const Staff = await user_model.findOne({ id: StaffID, department: HODdep });
    var final = [];
    if (HOD.role == "ACADEMIC MEMBER") {
      if (Staff != null) {
        final.push({ ID: Staff.id, Name: Staff.name, Day_off: Staff.dayoff });
        return res.send(final);
      } else {
        return res.send(
          "There in no staff member in your department with this ID !!"
        );
      }
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/ViewAllReq").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    const dayOffReq = await changeDayOffReq_model.find();
    const leavesReq = await leavesReq_model.find();
    var dayoff = [];
    var leaves = [];
    var final;
    if (HOD.role == "ACADEMIC MEMBER") {
      // dayoff.push("Day off requests ");
      for (let i = 0; i < dayOffReq.length; i++) {
        const id = dayOffReq[i].senderId;
        const user = await user_model.findOne({ id: id });
        const userDep = user.department;
        if (dayOffReq[i].status == "PENDING" &&dayOffReq[i].canceled==false) {
          if (userDep == HODdep) {
            dayoff.push(dayOffReq[i]);
          }
        }
      }
      //  leaves.push("Leaves requests ");
      for (let i = 0; i < leavesReq.length; i++) {
        const id = leavesReq[i].senderId;
        const user = await user_model.findOne({ id: id });
        const userDep = user.department;
        if (leavesReq[i].status == "PENDING"&&leavesReq[i].canceled==false) {
          if (userDep == HODdep) {
            leaves.push(leavesReq[i]);
          }
        }
      }
      final = { Day_off_requests: dayoff, Leaves_requests: leaves };
      if (dayOffReq.length > 0 && leavesReq.length > 0) {
        return res.send(final);
      } else {
        return res.send("There is no requests ");
      }
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/acceptDayOff").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    if (HOD.role == "ACADEMIC MEMBER") {
      const reqId = req.body.reqId;

      const dayOffReq = await changeDayOffReq_model.findOne({ _id: reqId });
      const requestedDay = dayOffReq.reqDay;

      const senderId = dayOffReq.senderId;
      await user_model.find({ id: senderId }).update({ dayoff: requestedDay });
      await changeDayOffReq_model
        .findOne({ _id: reqId })
        .update({ status: "ACCEPTED" });
      const newNotification = new notifications_model({
        userId: dayOffReq.senderId,
        message: `Your change day off request for ${dayOffReq.reqDay} has been accepted by ${req.user.id}!`,
      });
      try {
        await newNotification.save();
      } catch (err) {
        console.log(err);
      }

      return res.send("Accepted !!");
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/rejectDayOff").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    if (HOD.role == "ACADEMIC MEMBER") {
      const reqId = req.body.reqId;
      const comment = req.body.comment;

      const dayOffReq = await changeDayOffReq_model
        .findOne({ _id: reqId })
        .update({ status: "REJECTED", comment: comment });
      const newNotification = new notifications_model({
        userId: dayOffReq.senderId,
        message: `Your change day off request for ${dayOffReq.reqDay} has been rejected by ${req.user.id}  >>Comment<< : ${comment}!`,
      });
      try {
        await newNotification.save();
      } catch (err) {
        console.log(err);
      }
      return res.send("Rejected !!");
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/acceptLeave").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    //const HODdep = HOD.department;
    const reqId = req.body.reqId;
    const leave = await leavesReq_model.findOne({ _id: reqId });
    const leaveType = leave.type;
    const senderId = leave.senderId;
    const sender = await user_model.findOne({ id: senderId });

    if (HOD.role == "ACADEMIC MEMBER") {
      if (leaveType == "ANNUAL") {
        if (sender.annualleavesBalance < 1) {
          return res.send("There is no more annual leaves in your balance !!");
        } else if (sender.annualleavesBalance >= 1) {
          const newBalance = sender.annualleavesBalance - 1;
          await user_model
            .findOne({ id: senderId })
            .update({ annualleavesBalance: newBalance });
          const newLeave = new leaves_model({
            id: senderId,
            type: "ANNUAL",
            date: leave.date,
            dateTo: leave.dateTo,
          });
          try {
            await newLeave.save();
          } catch (err) {
            console.log(err);
          }
          await leavesReq_model
            .findOne({ _id: reqId })
            .update({ status: "ACCEPTED" });

          const newNotification = new notifications_model({
            userId: newLeave.senderId,
            message: `Your leave request for ${newLeave.reqDay} has been accepted by ${req.user.id}!`,
          });
          try {
            await newNotification.save();
          } catch (err) {
            console.log(err);
          }

          return res.send("Accepted !!");
        }
      } else if (leaveType == "ACCIDENTAL") {
        if (sender.accidentalLeavesBalance < 1) {
          return res.send(
            "There is no more accidental leaves in your balance !!"
          );
        } else if (
          sender.accidentalLeavesBalance >= 1 &&
          sender.annualleavesBalance >= 1
        ) {
          const newBalance = sender.accidentalLeavesBalance - 1;
          await user_model
            .findOne({ id: senderId })
            .update({ accidentalLeavesBalance: newBalance });
          const newBalance2 = sender.annualleavesBalance - 1;
          await user_model
            .findOne({ id: senderId })
            .update({ annualleavesBalance: newBalance2 });
          const newLeave = new leaves_model({
            id: senderId,
            type: "ACCIDENTAL",
            date: leave.date,
            dateTo: leave.dateTo,
          });
          try {
            await newLeave.save();
          } catch (err) {
            console.log(err);
          }
          await leavesReq_model
            .findOne({ _id: reqId })
            .update({ status: "ACCEPTED" });
          const newNotification = new notifications_model({
            userId: newLeave.senderId,
            message: `Your leave request for ${newLeave.reqDay} has been accepted by ${req.user.id}!`,
          });
          try {
            await newNotification.save();
          } catch (err) {
            console.log(err);
          }
          return res.send("Accepted !!");
        } else if (
          sender.accidentalLeavesBalance >= 1 &&
          sender.annualleavesBalance < 1
        ) {
          return res.send("There is no more leaves in your balance !!");
        }
      } else if (leaveType == "SICK") {
        const todate = new Date(leave.dateTo);
        const newLeave = new leaves_model({
          id: senderId,
          type: "SICK",
          date: leave.date,
          // dateTo:todate.setMonth(date.getMonth()+1)
        });

        try {
          await newLeave.save();
        } catch (err) {
          console.log(err);
        }
        await leavesReq_model
          .findOne({ _id: reqId })
          .update({ status: "ACCEPTED" });
        const newNotification = new notifications_model({
          userId: newLeave.senderId,
          message: `Your leave request for ${newLeave.reqDay} has been accepted by ${req.user.id}!`,
        });
        try {
          await newNotification.save();
        } catch (err) {
          console.log(err);
        }
        return res.send("Accepted !!");
      } else if (leaveType == "MATERNITY") {
        const todate = new Date(leave.dateTo);
        const newLeave = new leaves_model({
          id: senderId,
          type: "MATERNITY",
          date: leave.date,
          dateTo: todate.setMonth(todate.getMonth() + 1),
        });
        try {
          await newLeave.save();
        } catch (err) {
          console.log(err);
        }
        await leavesReq_model
          .findOne({ _id: reqId })
          .update({ status: "ACCEPTED" });
        const newNotification = new notifications_model({
          userId: newLeave.senderId,
          message: `Your leave request for ${newLeave.reqDay} has been accepted by ${req.user.id}!`,
        });
        try {
          await newNotification.save();
        } catch (err) {
          console.log(err);
        }
        return res.send("Accepted !!");
      } else if (leaveType == "COMPENSATION") {
        const todate = new Date(leave.dateTo);
        const newLeave = new leaves_model({
          id: senderId,
          type: "COMPENSATION",
          date: leave.date,
          dateTo: todate,
        });
        try {
          await newLeave.save();
        } catch (err) {
          console.log(err);
        }
        await leavesReq_model
          .findOne({ _id: reqId })
          .update({ status: "ACCEPTED" });
        const newNotification = new notifications_model({
          userId: newLeave.senderId,
          message: `Your leave request for ${newLeave.reqDay} has been accepted by ${req.user.id}!`,
        });
        try {
          await newNotification.save();
        } catch (err) {
          console.log(err);
        }
        return res.send("Accepted !!");
      }
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/rejectLeave").post(async (req, res) => {
  try {
    const HODid = req.user.id;
    const HOD = await user_model.findOne({ id: HODid });
    const HODdep = HOD.department;
    if (HOD.role == "ACADEMIC MEMBER") {
      const reqId = req.body.reqId;
      const comment = req.body.comment;

      const newLeave = await leavesReq_model
        .findOne({ _id: reqId })
        .update({ status: "REJECTED", comment: comment });
      const newNotification = new notifications_model({
        userId: newLeave.senderId,
        message: `Your leave request for ${newLeave.reqDay} has been rejected by ${req.user.id}! >>Comment<< ${comment} `,
      });
      try {
        await newNotification.save();
      } catch (err) {
        console.log(err);
      }
      return res.send("Rejected !!");
    } else {
      return res.send("This page can not be accessed !!");
    }
  } catch (error) {
    return res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.route("/coverage").post(async (req, res) => {
  const HODid = req.user.id;
  const HOD = await user_model.findOne({ id: HODid });
  const HODdep = HOD.department;
  let assigned = 0;
  let unassigned = 0;
  const role = HOD.role;
  console.log(role);
  if (role == "ACADEMIC MEMBER") {
    const result = [];
    const courses = await courses_model.find({ department: HODdep });
    for (let i = 0; i < courses.length; i++) {
      const element = courses[i];
      const id = courses[i].id;
      const slots = await slot_model.find({ course: id });
      for (let j = 0; j < slots.length; j++) {
        const slot = slots[j];
        if (slot.instructor == null || slot.instructor == "") {
          unassigned++;
        } else {
          assigned++;
        }
      }
      result.push({
        id: id,
        coverage: (assigned / slots.length) * 100,
        Slots: slots,
      });
    }
    res.send(result);
  } else {
    res.send("Error accessing this page");
  }
});
// router.route('/in')
// .get(async (req,res)=>{
//     const date = new Date();
//     date.setUTCFullYear(2020,1,1);
//     const newSlot=new leavesReq_model({
//         senderId:"2",
//              type:"MATERNITY",
//              date:"2/2/2020",
//              dateTo:date
//     })

//    try{
//        await newSlot.save();
//    }catch(err){
//        console.log(err);
//    }
//    res.send("Done")
// })
module.exports = router;
