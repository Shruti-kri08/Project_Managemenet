require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')


//routes
const userRoutes=require('./routes/user')

//Connect DB
const connectWithDatabase=async()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URL)
    }
    catch(err)
   { console.log(err);

   }
    
}
connectWithDatabase()


app.use('/user',userRoutes)


module.exports=app