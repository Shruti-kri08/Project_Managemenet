require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser=require("body-parser")
const fileUpload = require('express-fileupload');
const rateLimit = require("express-rate-limit");


//routes
const userRoutes=require('./routes/user')
const projectRoutes=require('./routes/project')
const collaboratorRoutes=require('./routes/collaborator')
const taskRoutes=require('./routes/task')

//Connect DB
const connectWithDatabase=async()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URL)
       console.log("connected with database..");
       
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
app.use('/project',projectRoutes)
app.use('/collaborator',collaboratorRoutes)
app.use('/task',taskRoutes)


module.exports=app