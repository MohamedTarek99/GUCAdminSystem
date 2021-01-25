const mongoose=require('mongoose');
const blockedTokenSchema=new mongoose.Schema({
    header:{
        type:String
    }
})

module.exports=mongoose.model('BlockedToken',blockedTokenSchema);