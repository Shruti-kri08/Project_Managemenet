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
    imageUrl:uploadImage.secure_url,
    imageId:uploadImage.public_id

  })
  const result=await task.save()
  res.status(200).json({message:"task uploaded successfullt..!!",
    task:result
  })

   
   
    

})

// update task
router.put('/updateTask/:taskId', async(req,res)=>{
    try{

        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token , process.env.SEC_KEY)

        // checking task exist or not
        const task = await task.findById(req.params.taskId)

        if(!task){
            return res.status(500).json({
                message:"task not exist"
            })
        }

        // finding project
        const project = await Project.findById(task.projectId)

        if(!project){
            return res.status(500).json({
                message:"project not exist"
            })
        }

        // checking owner
        if(tokenData.userId != project.adminId){
            return res.status(500).json({
                message:"only owner can update task"
            })
        }

        const newTask = {
            task : req.body.task,
            description : req.body.description,
            status : req.body.status
        }
        
        // update file
      if(req.files)
      {
         cloudinary.uploader.destroy(task.imageId)
         const uploadResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
         newTask["imageId"]= uploadResult.public_id,
         newTask["imageUrl"] = uploadResult.secure_url
      }
      else
      {
         newTask["imageId"] = task.imageId,
         newTask["imageUrl"] = task.imageUrl
      }

       
        await newTask.save()

        res.status(200).json({
            message:"task updated successfully",
            task:newTask
        })

    } 
    catch(error)
    {

        res.status(500).json({
           error : err
        })
    }
})

module.exports=router