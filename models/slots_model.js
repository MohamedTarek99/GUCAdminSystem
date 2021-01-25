const mongoose=require('mongoose');
const slotSchema=new mongoose.Schema({
   
 date:{
     type:Date,
     required:true
 },
 location:{
     type:String,
required:true
 },
 instructor:{
     type:String,
     default:null
 },
  course:{
      type:String,
      required:true
  }
})

module.exports=mongoose.model('Slots',slotSchema);   