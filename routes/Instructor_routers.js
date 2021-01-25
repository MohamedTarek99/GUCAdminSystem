const user_model = require("../models/user_model");
const slot_model = require("../models/slots_model");
const courses_model = require("../models/courses_model");

const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
require("dotenv").config();

router.route("/assignments").get(async (req, res) => {
  try {
    let assigned = 0;
    // let unassigned = 0;
    if (true) {
      const result = [];
      const courses = await courses_model.find({ instructors: req.user.id });
      for (let i = 0; i < courses.length; i++) {
        // const element = courses[i];
        const id = courses[i].id;
        const slots = await slot_model.find({ course: id });
        for (let j = 0; j < slots.length; j++) {
          const slot = slots[j];
          if (slot.instructor == null) {
            // unassigned++;
          } else {
            const AcademicName = await user_model.findOne({
              id: slot.instructor,
            });
            slots.AcademicName = AcademicName.name;
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
  } catch {
    res.send("An error has occured");
  }
});
router.route("/courseAssignments").post(async (req, res) => {
  try {
    let assigned = 0;
    // let unassigned = 0;
    const resarray = [];

    const slots = await slot_model.find({ course: req.body.id });
    console.log(req.body.id);
    console.log(slots);
    let result;
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
        // unassigned++;
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

        assigned++;
      }
    }
    if (slots.length === 0) {
      result = { coverage: 100, Slots: slots };
    } else {
      result = { coverage: (assigned / slots.length) * 100, Slots: resarray };
    }

    console.log(result);
    res.send(result);
  } catch {
    res.send("An error has occured");
  }
});

router.route("/getInstructorCourses").get(async (req, res) => {
  console.log("A");
  console.log("B");
  const courses = await courses_model.find({ instructors: req.user.id });
  res.send(courses);
});

router.route("/viewDepartmentStaff").get(async (req, res) => {
  const result = [];
  const id = req.user.id;
  try {
    const users = await user_model.findOne({ id: id });
    console.log(users);
    const department = users.department;
    const staff = await user_model.find({ department: department });
    for (let i = 0; i < staff.length; i++) {
      const user = staff[i];
      result.push({
        name: user.name,
        id: user.id,
        email: user.email,
        gender: user.gender,
        department: user.department,
        faculty: user.faculty,
        dayoff: user.dayoff,
        office: user.office,
      });
    }
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

router.route("/IviewProfile").post(async (req, res) => {
  const id = req.body.id;
  const users = await user_model.findOne({ id: id });
  if (users) {
    const result = {
      name: users.name,
      id: users.id,
      email: users.email,
      gender: users.gender,
      department: users.department,
      faculty: users.faculty,
      dayoff: users.dayoff,
    };
    res.send(result);
  }
});
router.route("/viewCourseStaff").post(async (req, res) => {
  const result = [];
  // const course = req.body.course;
  const courses = await courses_model.findOne({
    id: req.body.course,
    instructors: req.user.id,
  });
  if (!courses) {
    res.send("You are not an instructor for this course");
    return;
  }
  const coordinatorId = courses.coordinator;
  const instructorsIds = courses.instructors;
  const teachingAssistantsIds = courses.teachingAssistants;
  const coordinator = await user_model.findOne({ id: coordinatorId });
  const instructors = await user_model.find({ id: { $in: instructorsIds } });
  const teachingAssistants = await user_model.find({
    id: { $in: teachingAssistantsIds },
  });
  console.log(courses.instructors);
  let coordinatorinfo = undefined;
  if (coordinator) {
    coordinatorinfo = {
      name: coordinator.name,
      id: coordinator.id,
      email: coordinator.email,
      gender: coordinator.gender,
      department: coordinator.department,
      faculty: coordinator.faculty,
      dayoff: coordinator.dayoff,
      office: coordinator.office,
    };
  }
  result.push({ Coordinator: [coordinatorinfo] });

  const instructorsInfo = [];
  for (let index = 0; index < instructors.length; index++) {
    const instructor = instructors[index];
    const instructorinfo = {
      name: instructor.name,
      id: instructor.id,
      email: instructor.email,
      gender: instructor.gender,
      department: instructor.department,
      faculty: instructor.faculty,
      dayoff: instructor.dayoff,
      office: instructor.office,
    };
    instructorsInfo.push(instructorinfo);
  }
  result.push({ Instructors: instructorsInfo });
  const teachingAssistantsInfo = [];
  for (let index = 0; index < teachingAssistants.length; index++) {
    const teachingAssistant = teachingAssistants[index];
    const teachingAssistantinfo = {
      name: teachingAssistant.name,
      id: teachingAssistant.id,
      email: teachingAssistant.email,
      gender: teachingAssistant.gender,
      department: teachingAssistant.department,
      faculty: teachingAssistant.faculty,
      dayoff: teachingAssistant.dayoff,
      office: teachingAssistant.office,
    };
    teachingAssistantsInfo.push(teachingAssistantinfo);
  }
  result.push({ "Teaching Assistants": teachingAssistantsInfo });

  res.send(result);
});

router.route("/assignSlot").put(async (req, res) => {
  // const slot=await slot_model({id:req.body.slotid}).findOne()
  const slotid = req.body.slot;
  const instructor = req.body.id;
  const idfound = await user_model.findOne({ id: instructor });
  console.log(idfound);
  if (!idfound) {
    res.send("ID not found");
    return;
  }
  const updated = await slot_model.findOneAndUpdate(
    { _id: slotid, instructor: null },
    { instructor: instructor }
  );
  console.log(updated);
  if (updated) {
    const course = updated.course;
    const courseinstruct = await courses_model.findOne({
      id: course,
      $or: [
        { instructors: instructor },
        { coordinator: instructor },
        { teachingAssistants: instructor },
      ],
    });
    if (courseinstruct) {
      res.send("Slot assigned Succesfully");
      return;
    } else {
      // const newstaff = await courses_model.findOneAndUpdate(
      //   { id: course },
      //   { $push: { teachingAssistants: [instructor] } }
      // );
      res.send("Slot assigned Succesfully");
    }
  } else {
    res.send("Cannot assign the staffMember to this slot");
  }
});
router.route("/assignCoordinator").put(async (req, res) => {
  const instructorid = req.body.instructorid;
  const courseid = req.body.courseid;

  const coordinator = await user_model.findOne({ id: instructorid });
  if (coordinator) {
    const alreadycoordinator=await courses_model.findOne({coordinator:instructorid})
    if(alreadycoordinator){
      res.send("This user is already a coordinator in another course");
      return;
    }
    const course = await courses_model.findOneAndUpdate(
      { id: courseid },
      { coordinator: instructorid }
    );
    if (course) {
      res.send("Coordinator assigned succesfully!");
    } else {
      res.send("Course id was not found");
    }
  } else {
    res.send("Invalid ID");
  }
});

router.route("/deleteAssignment").put(async (req, res) => {
  const instructorid = req.body.instructor;
  const courseID = req.body.courseid;

  // const update = await slot_model.updateMany(
  //   { course: courseID, instructor: instructorid },
  //   { instructor: null }
  // );
  const user = await user_model.findOne({ id: instructorid });
  const course = await courses_model.findOne({ id: courseID });
  console.log(req.body);

  if (user) {
    let updated = undefined;
    if (course.coordinator === instructorid) {
      updated = await courses_model.findOneAndUpdate(
        { id: courseID, coordinator: user.id },
        { coordinator: null }
      );
    } else {
      updated = await courses_model.findOneAndUpdate(
        { id: courseID },
        {
          $pullAll: {
            teachingAssistants: [instructorid],
            instructors: [instructorid],
          },
        }
      );
    }
    if (updated) {
      res.send("Assignment was deleted succesfully");
    } else {
      res.send("Invalid course id");
    }
  } else {
    res.send("ID not found in this course assignments");
  }
});

router.route("/updateAssignment").put(async (req, res) => {
  console.log()
  const instructorid = req.body.instructor;
  const newinstructorid = req.body.newinstructor;
  const instructorfound = await user_model.findOne({ id: newinstructorid });
  const newinstructorfound = await user_model.findOne({ id: instructorid });
  const caller = req.user.id;
  console.log(newinstructorid);
  console.log(instructorfound);
  console.log(instructorid);
  console.log(newinstructorfound);
  if (!instructorfound || !newinstructorfound) {
    res.send("Invalid ID");
    return;
  }

  const courseID = req.body.courseid;
  const callercourse = await courses_model.findOne(
    { id: courseID },
    { instructors: caller }
  );
  if (!callercourse) {
    res.send("you cannot update in this course");
    return;
  }
  const updated = await slot_model.updateMany(
    { instructor: instructorid, course: courseID },
    { instructor: newinstructorid }
  );
  const course = await courses_model.findOne({ id: courseID });
  let t = false;
  if (course.instructors) {
    if (course.instructors.includes(instructorid)) {
      t = true;
      await courses_model.findOneAndUpdate(
        { id: courseID },
        { $pullAll: { instructors: [instructorid] } }
      );
      await courses_model.findOneAndUpdate(
        { id: courseID },
        { $push: { instructors: [newinstructorid] } }
      );
    }
  }
  if (course.teachingAssistants) {
    if (course.teachingAssistants.includes(instructorid)) {
      t = true;
      await courses_model.findOneAndUpdate(
        { id: courseID },
        { $pullAll: { teachingAssistants: [instructorid] } }
      );
      await courses_model.findOneAndUpdate(
        { id: courseID },
        { $push: { teachingAssistants: [newinstructorid] } }
      );
    }
  }
  if (course.coordinator) {
    if (course.coordinator.includes(instructorid)) {
      t = true;
      console.log('here');

      await courses_model.findOneAndUpdate(
        { id: courseID },
        { coordinator:null }
      );
      console.log('nope')

      await courses_model.findOneAndUpdate(
        { id: courseID },
        { coordinator: instructorid }
      );
    }
  }
  if (t) {
    res.send("Assignment was updated succesfully");
  } else {
    res.send("An error has occured");
  }
});

module.exports = router;
