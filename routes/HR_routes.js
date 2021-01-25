const roomModel = require('../models/room_model');
const facultyModel = require('../models/faculties_model');
const departmentModel = require('../models/department_model');
const courseModel = require('../models/courses_model');
const userModel = require('../models/user_model');
const attendanceModel = require('../models/attendance_model');
const leavesModel = require('../models/leaves_model');
const slotsModel=require('../models/slots_model');

const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const courses_model = require('../models/courses_model');
const { update } = require('../models/user_model');
const { EDESTADDRREQ } = require('constants');
const { Console } = require('console');
require('dotenv').config();

function getRangeDates() {
    const currentdate = new Date();
    const currentyear = currentdate.getFullYear();

    const currentday = currentdate.getDate();
    const currentmonth = currentdate.getMonth();
    let startingyear=0
    let startingmonth=0
    let startingday = 11
    let endingyear=0
    let endingmonth=0
    let endingday = 10
    if (currentday >= 11){
        startingyear = currentyear
        startingmonth = currentmonth
        if (startingmonth == 11){
   	    	endingmonth = 0
        	endingyear = currentyear + 1
        }
        else {
   	  	    endingmonth = currentmonth + 1
      	    endingyear = currentyear
        }
    }
    else {
        endingmonth = currentmonth
	    endingyear = currentyear
  	    if (endingmonth == 0){
    	    startingmonth = 11
      	    startingyear = currentyear - 1
        }
  	    else {
    	    startingmonth = currentmonth - 1
      	    startingyear = currentyear
        } 
    }
    const result={from:new Date(startingyear,startingmonth,startingday,2,0,0),to:new Date(endingyear,endingmonth,endingday,2,0,0)} 

    return result
}

async function getDaysandHours(user){
    const missingDays=[]
    let missinghours=0
    let extraday=false
   const userInfo=await userModel.findOne({id:user})
   const dayoff=userInfo.dayoff

   console.log(dayoff)
   var day
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
      day =6;
  }
   const attendance=await attendanceModel.find({id:user})
  
   const monthAttendance=attendance.filter(inRange)
   const range=getRangeDates()
   const fromday=range.from
   const today=range.to
   const leaves=await leavesModel.find({id:user})
   const monthLeaves=leaves.filter(inRangeleaves)
   const cur=new Date()
   const curDate=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate(),2,0,0)
   const curDate1=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate(),2,0,0)



   for (let index = fromday; fromday.getTime() <= curDate.getTime(); index++) {
       const todaysAttendance=[]
         for (let j = 0; j < monthAttendance.length; j++) {
             const element = monthAttendance[j];
             if(element.signInDate&&element.signOutDate){
                 if(element.signInDate.getDate()==fromday.getDate()){
                     todaysAttendance.push(element)
                 }
             }
            }
         
         if(todaysAttendance.length==0){
         
             if(fromday.getDay()==day||fromday.getDay()==5 ||acceptedLeave(monthLeaves,fromday)){
              

             }else{
                 const missingday=new Date(fromday)
              missingDays.push(missingday)
             
             }
         }else{
            let todayhours=0
            for (let l = 0; l < todaysAttendance.length; l++) {
                const element = todaysAttendance[l];
                todayhours=todayhours+element.hours
                
            }
            if(!compensationLeave(monthLeaves,fromday)&&fromday.getDay()==day){
                     todayhours=todayhours*60
            }else{
                todayhours=(todayhours*60)-504
            }
                missinghours=missinghours+(todayhours/60)

             }
           fromday.setDate(fromday.getDate()+1)
       
         }
         console.log(curDate.getTime()==curDate1.getTime())
        return{missingdays:missingDays,missinghours:missinghours}
        }
    
       
   


function compensationLeave(leaves,date){
    for (let index = 0; index < leaves.length; index++) {
        const element = leaves[index];
        if(element.type=="COMPENSATION"){
            if(element.dateTo.getTime()==date.getTime()){
                return true
            }
        }
        
    }
    return false
}



function inRange(x){
   const ranges= getRangeDates()
   if(x.signInDate==null||x.signOutDate==null){
       return false
   }
   return x.signInDate.getTime()>=ranges.from.getTime() &&x.signInDate.getTime()<=ranges.to.getTime()
}
function inRangeleaves(x){
    const ranges=getRangeDates()
    const currentdate=new Date()
    const currentday=new Date(currentdate.getFullYear(),currentdate.getMonth(),currentdate.getDate(),2)

    if(x.date.getTime()>=ranges.from.getTime() && x.date.getTime()<=currentday.getTime()){
        return true
    }
    if(x.dateTo){
        if(x.dateTo.getTime()<=currentday.getTime()&&x.dateTo.getTime()>=currentday.getTime()){
            return true;
        }
    }
    return false;
}
function acceptedLeave(leaves,date){
    console.log(leaves)
    for (let index = 0; index < leaves.length; index++) {
        const leave = leaves[index];
        if(leave.date.getTime()==date.getTime()){
            return true
        }
        if(leave.type=="COMPENSATION"){
           return false
        }
        if(leave.dateTo){

            if(leave.date.getTime()<=date.getTime() && leave.dateTo.getTime()>=date.getTime()){
             return true;
            }
        }
        
    }
    return false

}

router.use((req,res,next) => {
    if(req.user.role != "HR"){
        res.send("only HR members can access this");
    }
    else{
        next();
    }
})

router.route('/addDepartmentUnderFaculty')
.put(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else if(!req.body.faculty){
        res.send("Please enter faculty");
    }
    else{
        let departmentName = await departmentModel.findOne({name: req.body.name}).then(console.log("name of department obtained"))
        let departmentFaculty = await facultyModel.findOne({name:req.body.faculty});
        console.log(req.body)
        let departmentInFaculty = await facultyModel.findOne({name:req.body.faculty,department : req.body.name});
        console.log(departmentInFaculty)
        if (!departmentName){
        res.send("This department does not exist");  
        }
        else if (!departmentFaculty){
            res.send("This faculty does not exist");  
            }
        else if(departmentInFaculty){
            res.send("This department is already in faculty"); 
        }
     else{
        const filter = {name : req.body.name};
        try {
            await departmentModel.updateMany({name:req.body.name},{$push: {faculties: req.body.faculty}});
            await facultyModel.updateOne({name:req.body.faculty},{$push:{department:[req.body.name]}});
            res.send("Department added successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
    
     }
});



router.route('/addCourseUnderDepartment')
.put(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    } 
    else if(!req.body.department){
        res.send("Please enter department");
    }
    else{
        let departmentName = await departmentModel.findOne({name: req.body.department}).then(console.log("name of department obtained"))
        let departmentCourse = await courseModel.findOne({id:req.body.id});
        let courseInDepartment = await courseModel.findOne({department : req.body.department,id:req.body.id});
        if (!departmentName){
        res.send("This department does not exist");  
        }
        else if (!departmentCourse){
            res.send("This course does not exist");  
            }
        else if(courseInDepartment){
            res.send("This course is already in department");
        }
     else{
        const filter = {name : req.body.name};
        try {
            await departmentModel.updateMany({name:req.body.department},{$push: {courses: req.body.id}});
            await courseModel.updateOne({id:req.body.id},{department : req.body.department});
            res.send("Course added successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
    
     }
});
router.route('/addLocation')
.post(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    }
    else{
        let roomName = await roomModel.findOne({name: req.body.name}).then(console.log("location of room obtained"))
     if (roomName){
        res.send("This room already exists");  
     }
     else if((req.body.maxCapacity<req.body.capacity)||(req.body.capacity<0)||(req.body.maxCapacity<0)){
        res.send("Please enter correct capacity and maxCapacity")
     }
     else{
        const newRoom = new roomModel({
            name : req.body.name,
            type : req.body.type,
            capacity : req.body.capacity,
            maxCapacity : req.body.maxCapacity

        })
        try {
            await newRoom.save();
            res.send("Location added successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
      }
     
     }
});

router.route('/updateLocation')
.put(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let roomName = await roomModel.findOne({name: req.body.name}).then(console.log("location of room obtained"))
     if (!roomName){
        res.send("This room does not exist");  
     }
     else{
         if((req.body.update.capacity>req.body.update.maxCapacity)||(req.body.update.capacity<0)||(req.body.update.maxCapacity<0)){
            res.send("Capacity of this room can not be updated"); 
         }
        else{
            if(req.body.update.name){
                res.send("Location name can not be updated");
            }
        const filter = {name : req.body.name};
        try {
            await roomModel.updateOne(filter,req.body.update);
            res.send("Location updated successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    
        }
       }
     }
});

router.route('/deleteLocation')
.post(async (req,res) =>{
     let roomName = await roomModel.findOne({name: req.body.name}).then(console.log("location of room obtained"))
     if (!roomName){
        res.send("This room does not exist");  
     }
     else{
        if(!req.body.name){
            res.send("Please enter name");
        }
        else{
            try {
                await roomModel.deleteOne({name : req.body.name});
                await userModel.updateMany({office: req.body.name},{office: null});
                res.send("Location deleted successfully");
            } 
            catch (error) {
                console.log('error');
                res.send(error);
            }
        }
            
     }
});

router.route('/addFaculty')
.post(async (req,res) =>{
    console.log(req.body.department)
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let facultyName = await facultyModel.findOne({name: req.body.name}).then(console.log("name of faculty obtained"))
     if (facultyName){
        res.send("This faculty already exists");  
     }
     else{
        const newFaculty = new facultyModel({
            name : req.body.name,
            department : req.body.department
        })
        try {
            await newFaculty.save();
            res.send("Faculty added successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
     }
});

router.route('/updateFaculty')
.put(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let facultyName = await facultyModel.findOne({name: req.body.name}).then(console.log("name of faculty obtained"))
     if (!facultyName){
        res.send("This faculty does not exist");  
     }
     else{
         if(req.body.update.name){
             res.send("Faculty name can not be updated");
         }
         else{
            const filter = {name : req.body.name};
        try {
            await facultyModel.updateOne(filter,req.body.update);
            res.send("Faculty updated successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    
         }
        }
     }
});

router.route('/deleteFaculty')
.post(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let facultyName = await facultyModel.findOne({name: req.body.name}).then(console.log("name of faculty obtained"))
     if (!facultyName){
        res.send("This faculty does not exist");  
     }
     else{
            try {
                    await facultyModel.deleteOne({name : req.body.name});
                    await courseModel.updateMany({faculties: req.body.name}, { $pullAll: {faculties: [req.body.name]}});
                    await departmentModel.updateMany({faculties: req.body.name},{ $pullAll: {faculties: [req.body.name]}}); 
                    await userModel.updateMany({faculty: req.body.name},{faculty:null}); 
                res.send("Faculty deleted successfully");
            } 
            catch (error) {
                console.log('error');
                res.send(error);
            }
    
    }
     }
});

router.route('/addDepartment')
.post(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let departmentName = await departmentModel.findOne({name: req.body.name}).then(console.log("name of department obtained"))
     if (departmentName){
        res.send("This department already exists");  
     }
     else{
        const newDepartment = new departmentModel({
            name : req.body.name,
            faculties : req.body.faculties,
            courses : req.body.courses,
            HOD : req.body.HOD
        })
        try {
            await newDepartment.save();
            await facultyModel.updateMany({name:req.body.faculties}, { $push: {department: req.body.name}});
            res.send("Department added successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    
    }
     }
});

router.route('/updateDepartment')
.put(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let departmentName = await departmentModel.findOne({name: req.body.name}).then(console.log("name of department obtained"))
     if (!departmentName){
        res.send("This department does not exist");  
     }
     else{
         if(req.body.update.name){
            res.send("Name of department can not be updated");
         }
         else{
            const filter = {name : req.body.name};
        try {
            await departmentModel.updateOne(filter,req.body.update);
            res.send("Department updated successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    
    }
         }
        
     }
});

router.route('/deleteDepartment')
.post(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let departmentName = await departmentModel.findOne({name: req.body.name}).then(console.log("name of faculty obtained"))
     if (!departmentName){
        res.send("This department does not exist");  
     }
     else{
        try {
            await departmentModel.deleteOne({name : req.body.name});
            await facultyModel.updateMany({department:req.body.name}, { $pullAll: {department: [req.body.name]}});
            await courseModel.updateMany({department:req.body.name}, {department: null});
            await userModel.updateMany({department:req.body.name}, {department: null});
            res.send("department deleted successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
    
     }
});

function inRangeleaves(x){
  const ranges=getRangeDates()
  const currentdate=new Date()
  const currentday=new Date(currentdate.getFullYear(),currentdate.getMonth(),currentdate.getDate(),2)

  if(x.date.getTime()>=ranges.from.getTime() && x.date.getTime()<=currentday.getTime()){
      return true
  }
  if(x.dateTo){
      if(x.dateTo.getTime()<=currentday.getTime()&&x.dateTo.getTime()>=currentday.getTime()){
          return true;
      }
  }
  return false;
}

function inRangeattendance(x){
    const ranges=getRangeDates()
    const currentdate=new Date()
    const currentday=new Date(currentdate.getFullYear(),currentdate.getMonth(),currentdate.getDate(),2)

    if(x.date.getTime()>=ranges.from.getTime() && x.date.getTime()<=currentday.getTime()){
        return true
    }
   
    
    return false;
}


router.route('/deleteDepartmentUnderFaculty')
.put(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else if(!req.body.faculty){
        res.send("Please enter faculty");
    }
    else{
        let departmentName = await departmentModel.findOne({name: req.body.name}).then(console.log("name of department obtained"))
        let departmentFaculty = await departmentModel.findOne({faculties:req.body.faculty},{name:req.body.name});
        if (!departmentName){
        res.send("This department does not exist");  
        }
        else if (!departmentFaculty){
            res.send("This department is not in the faculty");  
            }
     else{
        const filter = {name : req.body.name};
        try {
            await userModel.updateMany({department:req.body.name},{faculty : null});
            await courseModel.updateMany({department:req.body.name},{$pullAll:{faculties:[req.body.faculty]}});
            await facultyModel.updateOne({name:req.body.faculty},{$pullAll:{department:[req.body.name]}});
            await departmentModel.update({faculties:req.body.faculty},{$pullAll:{faculties:[req.body.faculty]}});

            res.send("Department deleted successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
    
     }
});

router.route('/addCourse')
.post(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    }
    else{
        let courseID = await courseModel.findOne({id: req.body.id}).then(console.log("ID of course obtained"))
     if (courseID){
        res.send("This course already exists");  
     }
     else{
        const newCourse = new courseModel({
            id : req.body.id,
            name : req.body.name,
            faculties : req.body.faculties,
            department : req.body.department,
            coordinator: req.body.coordinator,
            instructors: req.body.instructors,
            teachingAssistants : req.body.teachingAssistants
        })
        try {
            await newCourse.save();
            await departmentModel.updateMany({name:req.body.department},{ $push: {courses: req.body.id}})
            res.send("Course added successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
    
     }
});

router.route('/updateCourse')
.put(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID")
    } 
    else{
        let courseID = await courseModel.findOne({id: req.body.id}).then(console.log("ID of course obtained"))
     if (!courseID){
        res.send("This course does not exist");  
     }
     else{
         if(req.body.update.id){
             res.send("ID of course can not be updated");
         }
         else{
            const filter = {id : req.body.id};
        try {
            await courseModel.updateOne(filter,req.body.update);
            res.send("Course updated successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    
    }
         }
     }
});

router.route('/deleteCourse')
.post(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    } 
    else{
        let courseID = await courseModel.findOne({id: req.body.id}).then(console.log("ID of course obtained"))
     if (!courseID){
        res.send("This course does not exist");  
     }
     else{
          try{
            await departmentModel.updateMany({courses:req.body.id},{ $pullAll: {courses: [req.body.id]}})
            await courseModel.deleteOne({id : req.body.id});
            await slotsModel.deleteMany({course:req.body.id})
            res.send("Course deleted successfully");
          }catch{

          
      
            console.log('error');
            res.send(error);
          }
        
    }
    
     }
});

router.route('/deleteCourseUnderDepartment')
.put(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    } 
    else if (!req.body.department){
        res.send("Please enter department");
     }
    else{
        let courseID = await courseModel.findOne({id: req.body.id}).then(console.log("ID of course obtained"))
        let departmentName = await departmentModel.findOne({name: req.body.department});
        let courseDepartment = await courseModel.findOne({department : req.body.department},{id:req.body.id});
     if (!courseID){
        res.send("This course does not exist");  
     }
     else if(!departmentName){
        res.send("This department does not exist");  
     }
     else if(!courseDepartment){
        res.send("This course is not in the department");
     }
     else{ 
        const filter = {id : req.body.id};
        try {
            await departmentModel.updateOne({name:req.body.department},{$pullAll:{courses:[req.body.id]}});
            await courseModel.updateOne(filter,{department: null});
            res.send("Course deleted successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
    
     }
});

router.route('/addUser')
.post(async (req,res) =>{
    if(!req.body.email){
        res.send("Please enter email");
    } 
    else{
        let userEmail = await userModel.findOne({email: req.body.email}).then(console.log("email of user obtained"))
     if (userEmail){
        res.send("This user already exists");  
     }
     else{
        let userOffice = await roomModel.findOne({name: req.body.office}).then(console.log("office of user obtained"))
        if(userOffice){
          console.log(userOffice)
        if(userOffice.capacity == userOffice.maxCapacity){
            res.send("The office assigned to this user is full");
        }
        else if(userOffice.type != "Office"){
            res.send("The room assigned to this user is not an office");
        }   
        else{
            const salt=await bcrypt.genSalt(10);
            const newPassword=await bcrypt.hash("123456",salt)
            if(req.body.role == "HR"){
                let userHR = await userModel.find({role: req.body.role}).then(console.log("All HRs obtained"))
                var hrIndex = userHR.length;
                if(userHR.length > 0){
                if(("hr-"+hrIndex)==(userHR[userHR.length-1].id)){
                        hrIndex += 1;
                }
              }
        
    
      
                const newUser = new userModel({
                    id : "hr-"+hrIndex,
                    name : req.body.name,
                    email : req.body.email,
                    password : newPassword,
                    role : req.body.role,
                    gender : req.body.gender,
                    salary: req.body.salary,
                    signedin : false,
                    faculty: req.body.faculty,
                    department : req.body.department,
                    dayoff : "Saturday",
                    office : req.body.office,
                    missinghours : 0,
                    extrahours : 0
                })
                try {
                    await newUser.save();
                    await roomModel.findOneAndUpdate({name : req.body.office},{$inc : {'capacity':1}});
                    res.send("User added successfully");
                } 
                catch (error) {
                    console.log('error');
                    res.send(error);
                }
            }
            else{
                if(req.body.role != "HR"){
                    let userAc = await userModel.find({role: {$ne : "HR"}}).then(console.log("All academics obtained"))
                    var acIndex = userAc.length+1;
                    if(userAc.length > 0){
                    if(("ac-"+acIndex)==(userAc[userAc.length-1].id)){ 
                        acIndex += 1;
                    }
                  }
                }
                const newUser = new userModel({
                    id : "ac-"+acIndex,
                    name : req.body.name,
                    email : req.body.email,
                    password : newPassword,
                    role : req.body.role,
                    gender : req.body.gender,
                    salary: req.body.salary,
                    signedin : false,
                    faculty: req.body.faculty,
                    department : req.body.department,
                    dayoff : req.body.dayoff,
                    office : req.body.office,
                    missinghours : 0,
                    extrahours : 0,
                    annualleavesBalance : req.body.annualleavesBalance,
                    accidentalLeavesBalance : req.body.accidentalLeavesBalance,
                    extraInfo : req.body.extraInfo
                })
                try {
                    await newUser.save();
                    await roomModel.findOneAndUpdate({name : req.body.office},{$inc : {'capacity':1}});
                    res.send("User added successfully");
                } 
                catch (error) {
                    console.log('error');
                    res.send(error);
                   }
                }
            }
        
        }
        else{
            res.send("The office assigned to this user does not exist");  
        }
    }
     
     }
});
router.route('/updateUser')
.put(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    } 
    else{
        let userID = await userModel.findOne({id: req.body.id}).then(console.log("ID of user obtained"))
     if (!userID){
        res.send("This user does not exist");  
     }
     else{
         if(userID.role == "HR"){
            const filter = {id : req.body.id};
            if(req.body.update.id||req.body.update.dayoff||req.body.update.email){
                res.send("can not change ID or dayoff or email");
            }
            else{
                let newOffice = await roomModel.findOne({name:req.body.update.office});
                if(newOffice){
                if(newOffice.type != "Office"){
                    res.send("user can only be assigned to office");
                }
                else if(newOffice.capacity==newOffice.maxCapacity){
                    res.send("user can not be assigned to a full office");
                }
                else{
                    const filter = {id : req.body.id};
                    try {
                        const oldOffice=userID.office
                        console.log(userID.office)
                        await roomModel.updateOne({name:req.body.update.office},{$inc:{'capacity':1}})
                        await roomModel.updateOne({name:oldOffice},{$inc:{'capacity':-1}})
                        await userModel.updateOne(filter,req.body.update);
                        res.send("User updated successfully");
                    } 
                        catch (error) {
                        console.log('error');
                        res.send(error);
                     }
                    }
                }
                try {
                    await userModel.updateOne(filter,req.body.update);
                    res.send("User updated successfully");
                } 
                catch (error) {
                    console.log('error');
                    res.send(error);
                }
            }
        
         }
         else{
            if(req.body.update.id||req.body.update.email){
                res.send("can not change ID or email");
            }
            else{
                let newOffice = await roomModel.findOne({name:req.body.update.office});
                if(newOffice){
                if(newOffice.type != "Office"){
                    res.send("user can only be assigned to office");
                }
                else if(newOffice.capacity==newOffice.maxCapacity){
                    res.send("user can not be assigned to a full office");
                }
                else{
                    const filter = {id : req.body.id};
                    try {
                        const oldOffice=userID.office
                        console.log(userID.office)
                        await roomModel.updateOne({name:req.body.update.office},{$inc:{'capacity':1}})
                        await roomModel.updateOne({name:oldOffice},{$inc:{'capacity':-1}})
                        await userModel.updateOne(filter,req.body.update);
                        res.send("User updated successfully");
                    } 
                        catch (error) {
                        console.log('error');
                        res.send(error);
                     }
                }
            }
                else{
                    const filter = {id : req.body.id};
                try {
                    await userModel.updateOne(filter,req.body.update);
                    res.send("User updated successfully");
                } 
                    catch (error) {
                    console.log('error');
                    res.send(error);
                 }
                }
                
            }
         
         }
    
    }
        
     }
});

router.route('/deleteUser')
.delete(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    } 
    else{
        let userID = await userModel.findOne({id: req.body.id}).then(console.log("ID of user obtained"))
     if (!userID){
        res.send("This user does not exist");  
     }
     else{
        try {
            await roomModel.findOneAndUpdate({name:userID.office},{$inc:{'capacity':-1}});
            await userModel.deleteOne({id : req.body.id});
            res.send("User deleted successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    }
    
     }
});

router.route('/viewAttendance')
.get(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    } 
    else{
        let userAttendance = await attendanceModel.find({id: req.body.id}).then(console.log("ID of user obtained"))
     if (userAttendance.length==0){
        res.send("This user has no attendance record or does not exist");  
     }
     else{
        try {
            res.send(userAttendance);
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    
    }
     }
});


        
    
router.route('/viewMissingHoursAndDays')
.get(async (req,res) =>{
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    let userArr = await userModel.find({id: {$ne : null}});
    const userMissingArr = [];
    let userMissing
    for(var i=0;i<userArr.length;i++){
        const daysAndHours = await getDaysandHours(userArr[i].id);
        console.log(daysAndHours)
        if(!((daysAndHours.missinghours >= 0)&&(daysAndHours.missingdays.length ==0))){
            if(daysAndHours.missinghours < 0){
                 userMissing = {
                    id : userArr[i].id,
                    name : userArr[i].name,
                    missingHours : daysAndHours.missinghours*-1,
                    missingDays :  daysAndHours.missingdays,
                    numberOfMissingDays : daysAndHours.missingdays.length
                };
            }
            else{
                 userMissing = {
                    id : userArr[i].id,
                    name : userArr[i].name,
                    missingHours : 0,
                    missingDays :  daysAndHours.missingdays,
                    numberOfMissingDays : daysAndHours.missingdays.length
                };
            }
            userMissingArr.push(userMissing);
        }
    }
    if(userMissingArr.length ==0 ){
        res.send("No users with missing hours or days");
    }
    else{
    res.send(userMissingArr);
    }
});

router.route('/updateSalary')
.put(async (req,res) =>{
    if(!req.body.id){
        res.send("Please enter ID");
    } 
    else{
        let userID = await userModel.findOne({id: req.body.id}).then(console.log("id of user obtained"))
     if (!userID){
        res.send("This user does not exist");  
     }
     else{
         if(req.body.salary){
        const filter = {id : req.body.id};
        try {
            await userModel.updateOne(filter,{salary : req.body.salary});
            res.send("Salary updated successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
      }
      else{
          res.send("Salary must be updated");
      }
    }
    
    }
});

router.route('/viewLocations')
.get(async (req,res) =>{
    let locationArr = await roomModel.find({name: {$ne : null}});
    res.send(locationArr);
});

router.route('/viewFaculties')
.get(async (req,res) =>{
    let facultyArr = await facultyModel.find({name: {$ne : null}});
    res.send(facultyArr);
});

router.route('/viewDepartments')
.get(async (req,res) =>{
    let departmentArr = await departmentModel.find({name: {$ne : null}});
    res.send(departmentArr);
});

router.route('/viewCourses')
.get(async (req,res) =>{
    let courseArr = await courseModel.find({id: {$ne : null}});
    res.send(courseArr);
});

router.route('/viewUsers')
.get(async (req,res) =>{
    let userArr = await userModel.find({id: {$ne : null}});
    res.send(userArr);
});

// router.route('/viewLocations')
// .get(async (req,res) =>{
//     let locationArr = await roomModel.find({name: {$ne : null}});
//     res.send(locationArr);
// });

// router.route('/viewLocations')
// .get(async (req,res) =>{
//     let locationArr = await roomModel.find({name: {$ne : null}});
//     res.send(locationArr);
// });

// router.route('/viewLocations')
// .get(async (req,res) =>{
//     let locationArr = await roomModel.find({name: {$ne : null}});
//     res.send(locationArr);
// });

router.route('/getOffices')
.get(async (req,res) =>{
    let OfficeArr = await roomModel.find({type : "Office"});
    var OfficeNames = []; 
     for(var i =0;i<OfficeArr.length;i++){
        OfficeNames.push(OfficeArr[i].name);
    }
    res.send(OfficeNames);
});

router.route('/getFaculties')
.get(async (req,res) =>{
    let facultyArr = await facultyModel.find({name: {$ne : null}});
    var facultyNames = []; 
     for(var i =0;i<facultyArr.length;i++){
        facultyNames.push(facultyArr[i].name);
    }
    res.send(facultyNames);
});
router.route('/viewMissingSigns')
.post(async(req,res)=>{
    
    const id=req.body.id;
   const attendance=await attendanceModel.find({id:id,$or:[{signInDate:null},{signOutDate:null}]});
   console.log(attendance)
   const monthattendance=attendance.filter(inRangeattendance);
   console.log(monthattendance);
   res.send(monthattendance)
    


})

router.route('/addSignin')
.put(async(req,res)=>{
    try{
    const id=req.body._id
    const hours=req.body.timeofsignin
    const daysignin=req.body.dayofsignin
    const monthsignin=req.body.monthofsignin
    const yearsignin=req.body.yearofsignin
    const minutessignin=req.body.minutesofsignin
    const signinDate=new Date(yearsignin,monthsignin-1,daysignin,hours+2,minutessignin,0,0)
    console.log(signinDate)
    if(signinDate.getHours()<7+2){
        signinDate.setHours(9)
         signinDate.setMinutes(0)
         signinDate.setSeconds(0)
         signinDate.setMilliseconds(0)
      }
      if(signinDate.getHours()>19+2){
         signinDate.setHours(21)
          signinDate.setMinutes(0)
          signinDate.setSeconds(0)
          signinDate.setMilliseconds(0)
     }
     console.log('a')
     console.log(id)
    const test= await attendanceModel.findOneAndUpdate({_id:id},{signInDate:signinDate})
     const x = await attendanceModel.findOne({_id:id})
     console.log(test)
     console.log(x);
     const signoutTime=x.signOutDate.getTime()
     var a = x.signInDate.getTime()
     var Hours=(signoutTime-a)/(60000*60)
     console.log(x.signInDate)
     console.log('b')
     console.log(x.signOutDate)
     if(Hours<0){
        await attendanceModel.findOneAndUpdate({_id:id},{signInDate:null})
    
         res.send("Invalid sign in date due to the hours being in negative!")
         return
     }
     if(x.signOutDate.getDate()!=x.signInDate.getDate()){
        await attendanceModel.findOneAndUpdate({_id:id},{signInDate:null})
         res.send('Dates do not have the same day');
         return
     }
     await attendanceModel.findOneAndUpdate({_id:id},{$set:{hours:Hours}})

    res.send("Sign in succesful")
    }catch{
        res.send("An error has occured")
    }
    })


    router.route('/addSignout')
    .put(async(req,res)=>{
        try{
        const id=req.body._id
        const hours=req.body.timeofsignout
        const daysignin=req.body.dayofsignout
        const monthsignin=req.body.monthofsignout
        const yearsignin=req.body.yearofsignout
        const minutessignin=req.body.minutesofsignin
        const signoutDate=new Date(yearsignin,monthsignin-1,daysignin,hours+2,minutessignin,0,0)
        if(signoutDate.getHours()>=19+2){
          signoutDate.setHours(19+2)
           signoutDate.setMinutes(0)
           signoutDate.setSeconds(0)
           signoutDate.setMilliseconds(0)
      }
      if(signoutDate.getHours()<=4){
       signoutDate.setHours(19+2)
       signoutDate.setMinutes(0)
       signoutDate.setSeconds(0)
       signoutDate.setMilliseconds(0)
       console.log("ASdadsad")
       signoutDate.setDate(signoutDate.getDate()-1)
      }
         await attendanceModel.findOneAndUpdate({_id:id},{signOutDate:signoutDate})
         const x = (await attendanceModel.findOne({_id:id}))
         const signoutTime=x.signOutDate.getTime()
         var a = x.signInDate.getTime()
         var Hours=(signoutTime-a)/(60000*60)
         console.log(x)
         if(x.signOutDate.getDate()!=x.signInDate.getDate()){
            res.send('Dates do not have the same day');
            await attendanceModel.findOneAndUpdate({_id:id},{signOutDate:null})

        }
         if(Hours<0){
            await attendanceModel.findOneAndUpdate({_id:id},{signOutDate:null})
        
             res.send("Invalid sign out date due to the hours being in negative!")
             return
         }
         try{
         await attendanceModel.findOneAndUpdate({_id:id},{$set:{hours:Hours}})
        res.send("Sign out recorded succesfully")
        return
         }catch{
             res.send("An error has occured")
         }
        }catch{
            res.send("An error has occured")
        }
        })
      

router.route('/getDepartments')
.get(async (req,res) =>{
    let departmentArr = await departmentModel.find({name: {$ne : null}});
    var departmentNames = []; 
     for(var i =0;i<departmentArr.length;i++){
        departmentNames.push(departmentArr[i].name);
    }
    res.send(departmentNames);
});

router.route('/getCourses')
.get(async (req,res) =>{
    let courseArr = await courseModel.find({id: {$ne : null}});
    var coursesIDs = []; 
     for(var i =0;i<courseArr.length;i++){
        coursesIDs.push(courseArr[i].id);
    }
    res.send(coursesIDs);
});

router.route('/AssignHODToDepartment')
.put(async (req,res) =>{
    if(!req.body.name){
        res.send("Please enter name");
    } 
    else{
        let departmentName = await departmentModel.findOne({name: req.body.name}).then(console.log("name of department obtained"))
        let HODID = await userModel.findOne({id : req.body.HOD});
        if (!departmentName){
        res.send("This department does not exist");  
     }
        else if(!HODID){
            res.send("This user does not exist");
        }
        else if(HODID.role == "HR"){
            res.send("HR can not be assigned to department");
        }
     else{
         
            const filter = {name : req.body.name};
        try {
            await departmentModel.updateOne(filter,{HOD : req.body.HOD});
            res.send("HOD assigned successfully");
        } 
        catch (error) {
            console.log('error');
            res.send(error);
        }
    
         }
        
     }
});


module.exports=router;

