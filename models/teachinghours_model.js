const mongoose=require('mongoose');
const teachingHoursSchema=new mongoose.Schema({
    id:{
type:String,
required:true
    },
 date:{
     type:Date,
     required:true
 },
 hours:{
     type:Number,
     default:0
 }
 
})

module.exports=mongoose.model('TeachingHours',teachingHoursSchema);   