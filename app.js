const express = require("express");
const cors = require("cors");
const app = express();
const user_routes = require("./routes/user_routes");
const instructor_routes = require("./routes/instructor_routers");
const coordinator_routes = require("./routes/coordinator_routes");
const staff_routes = require("./routes/staff_routes");
const attendance_model = require("./models/attendance_model");
const UniversityEntrance = require("./routes/UniversityEntrance");
const bcrypt = require("bcrypt");
const blockedToken_model = require("./models/blockedToken_model");
const HR_routes = require("./routes/HR_routes");
const academic_routes = require("./routes/academic_routes");
const HOD_routes = require("./routes/HOD_routes");
const notifications_routes = require("./routes/notifications_routes");

app.use(express.json());
app.use(cors());
const jwt = require("jsonwebtoken");
require("dotenv").config();
//const slots_model = require("./models/slots_model");
//const courses_model = require("./models/courses_model");
const leaves_model = require("./models/leaves_model");

//const { model } = require("./models/courses_model");
const user_model = require("./models/user_model");
const courses_model = require("./models/courses_model");
const department_model = require("./models/department_model");
//const e = require("express");

app.post("/test12345", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash("123", salt);
  await user_model.findOneAndUpdate(
    { email: "@mail.com" },
    { $set: { password: newPassword } }
  );
  res.send("Success");
});

app.get("/addAdmin", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash("123456", salt);

  const newUser = new user_model({
    id: "hr-" + 10,
    name: "testing",
    email: "mail.com",
    password: newPassword,
    role: "HR",
    gender: "Male",
    salary: 5000,
    signedin: false,
    faculty: "MET",
    department: "Math",
    dayoff: "Saturday",
    office: "C7",
    missinghours: 0,
    extrahours: 0,
  });
  try {
    await newUser.save();
    res.send("User added successfully");
  } catch (error) {
    console.log("error");
    res.send(error);
  }
});
app.post("/login", async (req, res) => {
  console.log(req.body);

  const users = await user_model.findOne({ email: req.body.email });
  console.log("test");
  if (!users) {
    res.send("please enter a valid E-mail");
  } else {
    if (users) {
      const correctPassword = await bcrypt.compare(
        req.body.password,
        users.password
      );

      if (correctPassword) {
        if (users.signedin === false) {
          const newpassword = req.body.newPassword;
          if (!newpassword) {
            res.send("Please reset your password");
          } else {
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(req.body.newPassword, salt);
            //const Password = users.password;
            await user_model.update(
              { email: users.email },
              { $set: { password: newPassword } }
            );
            await user_model.update(
              { email: users.email },
              { $set: { signedin: true } }
            );
            const token = jwt.sign(
              { _id: users._id, role: users.role, id: users.id },
              process.env.TOKEN_SECRET
            ); //digital signature
            res.header("token", token).send(token);
          }
        } else {
          const coordinator = await courses_model.findOne({
            coordinator: users.id,
          });
          const instructor = await courses_model.findOne({
            instructors: users.id,
          });
          const hod = await department_model.findOne({
            HOD: users.id,
          });
          let userRoles = [];
          if (coordinator) {
            userRoles.push("Coordinator");
          }
          if (instructor) {
            userRoles.push("Instructor");
          }
          if (hod) {
            userRoles.push("HeadOfDepartment");
          }
          const token = jwt.sign(
            {
              _id: users._id,
              role: users.role,
              roles: userRoles,
              id: users.id,
            },
            process.env.TOKEN_SECRET
          ); //digital signature
          res.header("token", token).send(token);
        }
      } else {
        return res.send("Invalid Password");
      }
    }
  }
});


app.use(async (req, res, next) => {
  let token = req.headers.token;

  if (!token || token === "null") {
    return res.status(401).send("Access Denied");
  }
  const tokens = await blockedToken_model.findOne({
    header: req.headers.token,
  });
  if (tokens) {
    res.status(401).send("Please log in first");
  } else {
    try {
      const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      console.log("error", token);
    }
  }
});
app.use("", UniversityEntrance);

app.use("", academic_routes);
app.use("/HR/", HR_routes);
app.use("", HOD_routes);
app.use("", notifications_routes);

// app.get('/test',async (req,res)=>{
// //     const newSlot=new slots_model({
// //         id:"1123",
// //         course:"csen",
// //         location:"c7",
// //         date:new Date(),
// //         instructor:"43-213"
// //     })
// //    try{
// //        await newSlot.save();
// //    }catch(err){
// //        console.log(err);
// //    }

// const newSlot=new courses_model({
//     id:"csen1",
//     instructors:["43-2156"]

// })

// await newSlot.save();
// res.send("OKAY")
// })
// app.get('/addSignin',async(req,res)=>{
// const id=req.body._id
// const staffid=req.body.id
// const hours=req.body.timeofsignin
// const daysignin=req.body.dayofsignin
// const monthsignin=req.body.monthofsignin
// const yearsignin=req.body.yearofsignin
// const signinDate=new Date(yearsignin,monthsignin-1,daysignin,hours+2,0,0,0)
// if(signinDate.getHours()<7+2){
//     signinDate.setHours(9)
//      signinDate.setMinutes(0)
//      signinDate.setSeconds(0)
//      signinDate.setMilliseconds(0)
//   }
//   if(signinDate.getHours()>19+2){
//      signinDate.setHours(21)
//       signinDate.setMinutes(0)
//       signinDate.setSeconds(0)
//       signinDate.setMilliseconds(0)
//  }
//  await attendance_model.findOneAndUpdate({id:staffid,_id:id},{signInDate:signinDate})
//  const x = (await attendance_model.findOne({id:staffid,_id:id}))
//  const signoutTime=x.signOutDate.getTime()
//  var a = x.signInDate.getTime()
//  var Hours=(signoutTime-a)/(60000*60)
//  console.log(x)
//  if(Hours<0){
//     await attendance_model.findOneAndUpdate({id:staffid,_id:id},{signInDate:null})

//      res.send("Invalid sign in date due to the hours being in negative!")
//      res.end()
//  }

//  await attendance_model.findOneAndUpdate({id:staffid,_id:id},{$set:{hours:Hours}})

// })

// app.get('/addSignout',async(req,res)=>{
//     const id=req.body._id
//     const staffid=req.body.id
//     const hours=req.body.timeofsignout
//     const daysignin=req.body.dayofsignout
//     const monthsignin=req.body.monthofsignout
//     const yearsignin=req.body.yearofsignout
//     const signoutDate=new Date(yearsignin,monthsignin-1,daysignin,hours+2,0,0,0)
//     if(signoutDate.getHours()>=19+2){
//       signoutDate.setHours(19+2)
//        signoutDate.setMinutes(0)
//        signoutDate.setSeconds(0)
//        signoutDate.setMilliseconds(0)
//   }
//   if(signoutDate.getHours()<=4){
//    signoutDate.setHours(19+2)
//    signoutDate.setMinutes(0)
//    signoutDate.setSeconds(0)
//    signoutDate.setMilliseconds(0)
//    console.log("ASdadsad")
//    signoutDate.setDate(signoutDate.getDate()-1)
//   }
//      await attendance_model.findOneAndUpdate({id:staffid,_id:id},{signOutDate:signoutDate})
//      const x = (await attendance_model.findOne({id:staffid,_id:id}))
//      const signoutTime=x.signOutDate.getTime()
//      var a = x.signInDate.getTime()
//      var Hours=(signoutTime-a)/(60000*60)
//      console.log(x)
//      if(Hours<0){
//         await attendance_model.findOneAndUpdate({id:staffid,_id:id},{signOutDate:null})

//          res.send("Invalid sign out date due to the hours being in negative!")
//          res.end()
//      }
//      try{
//      await attendance_model.findOneAndUpdate({id:staffid,_id:id},{$set:{hours:Hours}})
//     res.send("Sign in recorded succesfully")
//      }catch{
//          res.send("An error has occured")
//      }
//     })

app.get("/test123", async (req, res) => {
  const from = new Date(2020, 11, 20, 2, 0, 0, 0);
  const to = new Date(2020, 11, 21, 2, 0, 0, 0);

  const newleave = leaves_model({
    id: "43-2156",
    type: "COMPENSATION",
    date: from,
    dateTo: to,
  });
  newleave.save();
});
app.use("", user_routes);

app.use("", staff_routes);
app.use("", instructor_routes);
app.use("", coordinator_routes);

app.get("/test", async (req, res) => {
  const result = await getDaysandHours("43-2156");
  res.send(result);
});

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
  // let extraday = false;
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
  // const today = range.to;
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
  // const curDate1 = new Date(
  //   cur.getFullYear(),
  //   cur.getMonth(),
  //   cur.getDate(),
  //   2,
  //   0,
  //   0
  // );

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

module.exports.app = app; //module.exports=app might not work for some people
