const mongoose=require('mongoose');
const leavesSchema=new mongoose.Schema({
    id:{
type:String,
required:true
    },
 type:{
     type:String,
     enum:["ANNUAL","MATERNITY","SICK","ACCIDENTAL","COMPENSATION"],
     required:true
 },
 date:{
type:Date,
required:true
 },
 dateTo:{
     type:Date
 }

})

module.exports=mongoose.model('Leaves',leavesSchema);   