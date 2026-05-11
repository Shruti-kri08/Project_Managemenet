require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
const fileUpload = require('express-fileupload');


//routes
const userRoutes=require('./routes/user')

//Connect DB
const connectWithDatabase=async()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URL)
       console.log("connect with database..");
       
    }
    catch(err)
   { console.log(err);

   }
    
}
connectWithDatabase()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(fileUpload(
    {
    
    useTempFiles:true,        
    tempFileDir:'/temp/'

    }
))

app.use('/user',userRoutes)


module.exports=app