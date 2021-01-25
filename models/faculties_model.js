const mongoose=require('mongoose');
const facultySchema=new mongoose.Schema({

name:{
    type:String,
    required:true
},

department:[String],


})

module.exports=mongoose.model('Faculty',facultySchema);