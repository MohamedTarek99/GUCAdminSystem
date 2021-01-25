const mongoose=require('mongoose');
const attendanceSchema=new mongoose.Schema({
    id:{
type:String,
required:true
    },
 date:{
     type:Date,
     required:true
 },
 signInDate:{
     type:Date,
 },
 signOutDate:{
     type:Date,
 },
 hours:{
     type:Number,
     default:0
 }
 
})

module.exports=mongoose.model('Attendance',attendanceSchema);   