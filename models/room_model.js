const mongoose=require('mongoose');
const roomSchema=new mongoose.Schema({
    name:{
type:String,
required:true,
unique:true
    },
 type:{
     type:String,
    enum:[
        "Lab","Hall","Room","Office"
    ],
     required:true
 },
 capacity:{
     type:Number,
     default:0
 },
 maxCapacity : {
     type : Number,
     required : true
 }
 
})

module.exports=mongoose.model('Room',roomSchema);   