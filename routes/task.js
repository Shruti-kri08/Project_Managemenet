require('dotenv').config()
const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const Project=require('../models/Project')
const files=require('express-fileupload')
const cloudinary=require('cloudinary').v2
const Task=require('../models/Task')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

router.post('/create/:projectId',async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const tokenData=await jwt.verify(token,process.env.SEC_KEY)
    const project=await Project.findById(req.params.projectId)
    if(!project){

        return res.status(500).json({message:"Project not found"})

    }
   const isAdmin=(tokenData.userId==project.adminId.toString())
   const isCollaborator= project.collaborators.includes(tokenData.userId)
//    console.log(isCollaborator);
//    console.log(isAdmin);
   if(!isAdmin&& !isCollaborator){
   return res.status(500).json({
        message:"You are not allowed to create task..."
    })
   }
   const uploadImage=await cloudinary.uploader.upload(req.files.image.tempFilePath,{
    resource_type:"image",
    folder:"project-management/taskImages"
   })
  const task=new Task({
    task:req.body.task,
    description:req.body.description,
    createdBy:tokenData.userId,
    projectId:req.params.projectId,
    imageUrl:uploadImage.secure_url,
    imageId:uploadImage.public_id

  })
  const result=await task.save()
  project.tasks.push(result._id )
   await  project.save()

const savedTask=await Task.findById(result._id).populate('projectId')

    
  
 


  res.status(200).json({message:"task uploaded successfullt..!!",
      task:savedTask
  })
  

   
    

})

module.exports=router