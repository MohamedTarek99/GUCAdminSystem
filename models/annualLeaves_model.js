const mongoose=require('mongoose');
const annualSchema=new mongoose.Schema({
    id:{
type:String,
required:true
    },
 reciverid:{
     type:String,
 },
 slot:{
     type:Number,
required:true
 },
 recieverResponse:{
     type:Number,
    min:-1,
    max:1,
    default:-1
 },
 hodresponse:{
     type:Number,
     default:-1,
     min:-1,
    max:1,
    default:-1
 }
 
})

module.exports=mongoose.model('AnnualLeaves',annualSchema);   