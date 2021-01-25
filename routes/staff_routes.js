const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const user_model = require("../models/user_model");
// const { findOne } = require("../models/user_model");
const attendance_model = require("../models/attendance_model");
const blockedToken_model = require("../models/blockedToken_model");
const room_model = require("../models/room_model");
const leaves_model = require("../models/leaves_model");
// const { mquery } = require("mongoose");
require("dotenv").config();

router.route("/logout").post(async (req, res) => {
  const token = req.headers.token;
  const newUser = new blockedToken_model({
    header: token,
  });
  try {
    await newUser.save();
    res.send("logged out");
  } catch (error) {
    console.log(error);
  }
});

router.route("/viewProfile").get(async (req, res) => {
  //   const array = [];
  const id = req.user.id;
  const user = await user_model.findOne({ id: id });
  if (!user) {
    res.send("Invalid ID");
  } else {
    const name = user.name;
    const email = user.email;
    const department = user.department;
    const faculty = user.faculty;
    const office = user.office;
    const dayoff = user.dayoff;
    const ExtraInfo = user.extraInfo;
    const result = {
      id:user.id,
      name: name,
      email: email,
      department: department,
      faculty: faculty,
      office: office,
      dayoff: dayoff,
      ExtraInfo: ExtraInfo,
    };
    res.send(result);
  }
});

router.route("/updateProfile").put(async (req, res) => {
  const id = req.user.id;
  const user = await user_model.findOne({ id: id });
  if (!id) {
    res.send("Invalid ID");
  } else {
    if (req.body.newEmail) {
      const newEmail = req.body.newEmail;
      const Email = await user_model.findOne({ email: newEmail });
      if (Email) {
        res.send("email already in use");
      } else {
        await user_model.update(
          { id: req.user.id },
          { $set: { email: newEmail } }
        );
        res.send("Profile updated successfully");
      }
    } else {
      if (req.body.ExtraInfo) {
        await user_model.update(
          { id: req.user.id },
          { $set: { extraInfo: req.body.ExtraInfo } }
        );
        res.send("Extra information updated successfully");
      }
    }
    if (req.body.office) {
      const Office = req.body.office;
      const users = await room_model.findOne({ name: Office });
      if (!users) {
        res.send("Please enter a valid room");
      } else {
        if (users.type !== "Office" || users.capacity === users.maxCapacity) {
          res.send("Room cannot be updated");
        } else {
          const oldOffice = user.office;
          await room_model.findOneAndUpdate(
            { name: oldOffice },
            { $inc: { capacity: -1 } }
          );
          await room_model.findOneAndUpdate(
            { name: Office },
            { $inc: { capacity: +1 } }
          );

          await user_model.update(
            { id: req.user.id },
            { $set: { office: Office } }
          );
          res.send("profile updated successfully");
        }
      }
    }
  }
});

router.route("/resetPassword").put(async (req, res) => {
  const users = await user_model.findOne({ email: req.body.email });
  if (!users) {
    res.send("account not found");
  } else {
    const correctPassword = await bcrypt.compare(
      req.body.password,
      users.password
    );
    if (!correctPassword) {
      res.send("Wrong password");
    } else {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.newPassword, salt);
      //   const Password = users.password;
      //   const email = users.email;
      await user_model.update(
        { email: req.body.email },
        { $set: { password: newPassword } }
      );
      res.send("Password reseted successfully");
    }
  }
});

// router.route('/signIn')
// .post(async(req,res)=>{
//     const id = req.user.id
//     const user=await attendance_model.findOne({id:id})
//     if(!id){
//         res.send('Invalid ID')
//     }
//     const signinDate = new Date();
//     signinDate.setHours(signinDate.getHours()+2)

//     if(signinDate.getHours()<7+2){
//        signinDate.setHours(9)
//         signinDate.setMinutes(0)
//      }
//      if(signinDate.getHours()>19+2){
//         signinDate.setHours(21)
//          signinDate.setMinutes(0)

//     }
//     console.log(signinDate)
//      const newSignin = new attendance_model({
//          id:req.user.id,
//          date:signinDate,
//          signInDate:signinDate,
//          signOutDate:null
//      })
//      try{
//          await newSignin.save()
//          res.send('sign in recorded successfully')
//        }
//         catch(error){
//             console.log(error);
//        }
// })

// function checkToday(date){
//     const currentDate = new Date(Date.now())
//     return currentDate.getDate()==date.date.getDate() && currentDate.getMonth()+1==date.date.getMonth()+1 && currentDate.getFullYear()==date.date.getFullYear()
// }

// router.route('/signOut')
// .post(async(req,res)=>{
//     const id = req.user.id
//     const user=await attendance_model.findOne({id:id})

//     const users=await user_model.findOne({id:id})
//     if(!id){
//         res.send('Invalid ID')
//     }
//      const signoutDate = new Date();
//      let i=0
//      signoutDate.setHours(signoutDate.getHours()+2)
//      if(signoutDate.getHours()>=19+2){
//        signoutDate.setHours(19+2)
//         signoutDate.setMinutes(0)
//    }
//    if(signoutDate.getHours()<=4){
//     signoutDate.setHours(19+2)
//     signoutDate.setMinutes(0)
//     signoutDate.setDate(signoutDate.getDate()-1)
//    }
//     const array = await attendance_model.find({ id:req.user.id }).sort({ signInDate : -1})
//     const todayArray = array.filter(checkToday);
//     for (let index = 0; index < todayArray.length; index++) {
//         if(todayArray[index].signOutDate==null){
//             await attendance_model.findOneAndUpdate({id:req.user.id,_id:todayArray[index]._id},{signOutDate:signoutDate})
//             const x = (await attendance_model.findOne({id:req.user.id,_id:todayArray[index]._id}))
//             const signoutTime=x.signOutDate.getTime()
//             console.log(x)
//             var a = x.signInDate.getTime()
//             var Hours=(signoutTime-a)/(60000*60)
//             await attendance_model.findOneAndUpdate({id:req.user.id,_id:todayArray[index]._id},{$set:{hours:Hours}})
//             res.send('done')
//          break;
//         }
//         if(todayArray[index].signOutDate!= null && todayArray[index].signInDate!= null || todayArray[index].signInDate== null){
//             const newSignout = new attendance_model({
//                 id:req.user.id,
//                 date:signoutDate,
//                 signInDate:null,
//                 signOutDate:signoutDate
//             })
//             try{
//                 await newSignout.save()
//                 res.send('sign out recorded successfully')
//               }
//                catch(error){
//                    console.log(error);
//               }
//               break;
//             }
//         }
//     })

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

async function getDaysandHours(user) {
  const missingDays = [];
  let missinghours = 0;
  //   let extraday = false;
  const userInfo = await user_model.findOne({ id: user });
  const dayoff = userInfo.dayoff;

  var day;
  switch (dayoff) {
    case "Sunday":
      day = 0;
      break;
    case "Monday":
      day = 1;
      break;
    case "Tuesday":
      day = 2;
      break;
    case "Wednseday":
      day = 3;
      break;
    case "Thursday":
      day = 4;
      break;
    case "Saturday":
      day = 6;
      break;
    default:
  }
  const attendance = await attendance_model.find({ id: user });
  const monthAttendance = attendance.filter(inRange);
  const range = getRangeDates();
  const fromday = range.from;
  //   const today = range.to;
  const leaves = await leaves_model.find({ id: user });
  const monthLeaves = leaves.filter(inRangeleaves);
  const cur = new Date();
  const curDate = new Date(
    cur.getFullYear(),
    cur.getMonth(),
    cur.getDate(),
    2,
    0,
    0
  );
  const curDate1 = new Date(
    cur.getFullYear(),
    cur.getMonth(),
    cur.getDate(),
    2,
    0,
    0
  );
  for (let index = fromday; fromday.getTime() <= curDate.getTime(); index++) {
    const todaysAttendance = [];
    for (let j = 0; j < monthAttendance.length; j++) {
      const element = monthAttendance[j];
      if (element.signInDate && element.signOutDate) {
        if (element.signInDate.getDate() === fromday.getDate()) {
          todaysAttendance.push(element);
        }
      }
    }
    console.log(todaysAttendance.length);
    if (todaysAttendance.length === 0) {
      if (
        fromday.getDay() === day ||
        fromday.getDay() === 5 ||
        acceptedLeave(monthLeaves, fromday)
      ) {
      } else {
        const missingday = new Date(fromday);
        missingDays.push(missingday);
      }
    } else {
      let todayhours = 0;
      for (let l = 0; l < todaysAttendance.length; l++) {
        const element = todaysAttendance[l];
        todayhours = todayhours + element.hours;
      }
      if (
        !compensationLeave(monthLeaves, fromday) &&
        fromday.getDay() === day
      ) {
        todayhours = todayhours * 60;
      } else {
        todayhours = todayhours * 60 - 504;
      }
      missinghours = missinghours + todayhours / 60;
    }
    fromday.setDate(fromday.getDate() + 1);
  }
  console.log(curDate.getTime() === curDate1.getTime());
  return { missingdays: missingDays, missinghours: missinghours };
}

function compensationLeave(leaves, date) {
  for (let index = 0; index < leaves.length; index++) {
    const element = leaves[index];
    if (element.type === "COMPENSATION") {
      if (element.dateTo.getTime() === date.getTime()) {
        return true;
      }
    }
  }
  return false;
}

function inRange(x) {
  const ranges = getRangeDates();
  if (x.signInDate == null || x.signOutDate == null) {
    return false;
  }
  return (
    x.signInDate.getTime() >= ranges.from.getTime() &&
    x.signInDate.getTime() <= ranges.to.getTime()
  );
}
function inRangeleaves(x) {
  const ranges = getRangeDates();
  const currentdate = new Date();
  const currentday = new Date(
    currentdate.getFullYear(),
    currentdate.getMonth(),
    currentdate.getDate(),
    2
  );

  if (
    x.date.getTime() >= ranges.from.getTime() &&
    x.date.getTime() <= currentday.getTime()
  ) {
    return true;
  }
  if (x.dateTo) {
    if (
      x.dateTo.getTime() <= currentday.getTime() &&
      x.dateTo.getTime() >= currentday.getTime()
    ) {
      return true;
    }
  }
  return false;
}
function acceptedLeave(leaves, date) {
  console.log(leaves);
  for (let index = 0; index < leaves.length; index++) {
    const leave = leaves[index];
    if (leave.date.getTime() === date.getTime()) {
      return true;
    }
    if (leave.type === "COMPENSATION") {
      return false;
    }
    if (leave.dateTo) {
      if (
        leave.date.getTime() <= date.getTime() &&
        leave.dateTo.getTime() >= date.getTime()
      ) {
        return true;
      }
    }
  }
  return false;
}

router.route("/viewAttendanceRecord").post(async (req, res) => {
  const month = req.body.month;
  //   const id = req.user.id;
  const array = await attendance_model
    .find({ id: req.user.id })
    .sort({ date: -1 });
   console.log(array)
  if (!array) {
    res.send("there is no attendace recorded for this user");
  } else {
    if (!month) {
      res.send(array);
    } else {
      const array1 = [];
      for (let index = 0; index < array.length; index++) {
        if (array[index].date.getMonth() + 1 === month)
          array1.push(array[index]);
      }
      if (array1) {
        res.send(array1);
      } else {
        res.send("No attendance for the requested month");
      }
    }
  }
});
router.route("/viewMissingDays").get(async (req, res) => {
  const missingdays = (await getDaysandHours(req.user.id)).missingdays;
  if (missingdays.length === 0) {
    res.send("You have no missing days!");
    return;
  }
  res.send({
    numberOfMissingDays: missingdays.length,
    missingDays: missingdays,
  });
});

router.route("/viewmissingOrExtraHours").get(async (req, res) => {
  //   let array = [];
  let missinghours = (await getDaysandHours(req.user.id)).missinghours;
  console.log(missinghours);
  if (Math.sign(missinghours) === 1) {
   res.send("ExtraHours: " + missinghours);
  } else {
    if (Math.sign(missinghours) === -1) {
      missinghours = missinghours * -1;
       res.send("MissingHours: " + missinghours)
    } else {
      res.send("You have no missing or extra hours");
    }
  }
});

module.exports = router;
