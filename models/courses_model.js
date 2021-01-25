const mongoose=require('mongoose');
const courseSchema=new mongoose.Schema({
    id:{
type:String,
required:true,
unique:true
    },
name:{
    type:String,
},

faculties:[String],
department:{
    type:String
},
coordinator:{
    type:String,
},
instructors:[String]
,
teachingAssistants:[String]



})

module.exports=mongoose.model('Course',courseSchema);