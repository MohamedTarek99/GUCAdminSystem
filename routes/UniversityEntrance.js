const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const user_model=require('../models/user_model');
const { findOne } = require('../models/user_model');
const attendance_model=require('../models/attendance_model');
// const blockedToken_model = require('../models/blockedtoken_model');
const room_model=require('../models/room_model');
const leaves_model=require('../models/leaves_model');
const { mquery } = require('mongoose');
require('dotenv').config();

router.route('/signIn')
.post(async(req,res)=>{
    let date
    const id = req.user.id
    const user=await attendance_model.findOne({id:id})
    if(!id){
        res.send('Invalid ID')
    }
    const signinDate = new Date();
    console.log("Aaaaaaaaa")
    console.log(signinDate)
    signinDate.setHours(signinDate.getHours()+2)
    console.log(signinDate)

    if(signinDate.getHours()<=4){
        signinDate.setHours(21)
        signinDate.setMinutes(0)
        signinDate.setSeconds(0)
        signinDate.setMilliseconds(0)
        signinDate.setDate(signinDate.getDate()-1)
    }

    if(signinDate.getHours()<7+2 &&!(signinDate.getHours()<=4)){

            signinDate.setHours(9)
            signinDate.setMinutes(0)
            signinDate.setSeconds(0)
            signinDate.setMilliseconds(0)


        console.log(signinDate.getHours())
     }

       
     if(signinDate.getHours()>19+2){
        signinDate.setHours(21)
         signinDate.setMinutes(0)
         signinDate.setSeconds(0)
         signinDate.setMilliseconds(0)
        
    }

     date=new Date(signinDate.getFullYear(),signinDate.getMonth(),signinDate.getDate(),2,0,0,0)

    console.log(signinDate)
     const newSignin = new attendance_model({
         id:"24816",
         date:date,
         signInDate:signinDate,
         signOutDate:null
     })    
     try{
         await newSignin.save()
         res.send('sign in recorded successfully')
       }
        catch(error){
            console.log(error);
       }
})

function checkToday(date){
    const currentDate = new Date(Date.now())
    console.log(date.date)
    console.log(date.date.getMonth())
    console.log(date.date.getDate())
    return currentDate.getDate()==date.date.getDate() && currentDate.getMonth()+1==date.date.getMonth()+1 && currentDate.getFullYear()==date.date.getFullYear()
}

router.route('/signOut')
.post(async(req,res)=>{
    const id = "24816"
    const user=await attendance_model.findOne({id:id})
   
   
    const users=await user_model.findOne({id:id})
    if(!id){
        res.send('Invalid ID')
    }
     const signoutDate = new Date();
     console.log(signoutDate)
     console.log(signoutDate.getHours())
     let i=0
     signoutDate.setHours(signoutDate.getHours()+2)
     console.log(signoutDate.getHours())
     
     console.log("ah")
     console.log(signoutDate)
     console.log(signoutDate.getHours())
     if(signoutDate.getHours()>=19+2){
       signoutDate.setHours(19+2)
        signoutDate.setMinutes(0)
        signoutDate.setSeconds(0)
        signoutDate.setMilliseconds(0)
   }
   if(signoutDate.getHours()<=4){
    signoutDate.setHours(19+2)
    signoutDate.setMinutes(0)
    signoutDate.setSeconds(0)
    signoutDate.setMilliseconds(0)
    console.log("ASdadsad")
    signoutDate.setDate(signoutDate.getDate()-1)
   }
    
     
    const array = await attendance_model.find({ id:"24816" }).sort({ signInDate : -1})
    console.log("hoba")
    
    const todayArray = array.filter(checkToday);
    console.log(todayArray)
    for (let index = 0; index < todayArray.length; index++) {
        
        if(todayArray[index].signOutDate==null){
            console.log('omaaar')
            await attendance_model.findOneAndUpdate({id:"24816",_id:todayArray[index]._id},{signOutDate:signoutDate})
            const x = (await attendance_model.findOne({id:"24816",_id:todayArray[index]._id}))
            const signoutTime=x.signOutDate.getTime()
            var a = x.signInDate.getTime()
            var Hours=(signoutTime-a)/(60000*60)
            await attendance_model.findOneAndUpdate({id:"24816",_id:todayArray[index]._id},{$set:{hours:Hours}})
            res.send('sign out recorded successfully')
return
            console.log("test")
 
         break;   
        }
        const date=new Date(signoutDate.getFullYear(),signoutDate.getMonth(),signoutDate.getDate(),2,0,0,0)
        if(todayArray[index].signOutDate!= null && todayArray[index].signInDate!= null || todayArray[index].signInDate== null){
            const newSignout = new attendance_model({
                id:"24816",
                date:date,
                signInDate:null,
                signOutDate:signoutDate
            })        
            try{
                await newSignout.save()
                res.send('sign out recorded successfully')
return
              }
               catch(error){
                   console.log(error);
              }
              break;
            }

               
        }
        const date=new Date(signoutDate.getFullYear(),signoutDate.getMonth(),signoutDate.getDate(),2,0,0,0)


        const newSignout = new attendance_model({
            id:req.user.id,
            date:date,
            signInDate:null,
            signOutDate:signoutDate
        })        
        try{
            newSignout.save()
            res.send("sign out recorded successfully")
        }catch{
           res.send("An error has occured!")
        }
     
})
    module.exports=router;