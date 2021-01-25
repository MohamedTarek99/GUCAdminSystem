const mongoose=require('mongoose');
const departmentSchema=new mongoose.Schema({
    name:{
type:String,
required:true,
unique:true

    },
faculties:[String],
courses :[String],
HOD:[String],


})

module.exports=mongoose.model('Department',departmentSchema);