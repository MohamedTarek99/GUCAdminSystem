const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    id:{
type:String,
required:true,
unique:true

    },
name:{
    type:String,
},
email :{
    type:String,
    unique:true,
    required:true
},
password:{
    type:String,
    default:"123456"
},
role:{
    type:String,
    required:true,
    enum:[
        "HR","ACADEMIC MEMBER"
    ]
},
gender:{
    type:String,
    required:true,
    enum:[
        "Male","Female"
    ]

},
salary:{
    type:Number
},
signedin:{
    type:Boolean,
    default:false
},
faculty:{
    type:String
},
department:{
    type:String
},
dayoff:{
    type:String,
    enum:[
        "Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"
    ]
},
office:{
    type:String,
    required:true
},
missinghours:{
    type:Number,
    default:0
},
extrahours:{
    type:Number,
    default:0
},
annualleavesBalance:{
    default:2.5,
    type:Number
},
accidentalLeavesBalance:{
    default:6,
    type:Number
},

extraInfo:{
    type:Array,
 }
})

module.exports=mongoose.model('User',userSchema);