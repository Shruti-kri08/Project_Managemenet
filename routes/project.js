require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const User=require('../models/User')
const Project=require('../models/Project')
const Collaborator = require('../models/Collaborator')

// // send collaborator request api
// Router.post('/send-request/:userId',async(req,res)=>{
//     try
//     {
//         const token = req.headers.authorization.split(" ")[1]
//         const tokenData = await jwt.verify(token,process.env.SEC_KEY)
//         const user = await User.find(req.params.userId)
//         if(!user)
//         {
//             return res.status(500).json({
//                 error : 'User not found.....'
//             })
//         }

//         const adminId = await User.find(tokenData.userId)
//         if(req.params.userId == tokenData.userId)
//         {
//             return res.status(500).json({
//                 error : 'Admin-Id..'
//             })
//         }

        
       
//     }
//     catch(err)
//     {
//         console.log(err)
//         res.status(500).json({
//             error : err
//         })
//     }
// })

//create project
router.post('/create',async(req,res)=>{
    try{
     const token = req.headers.authorization.split(" ")[1]
    const tokenData = jwt.verify(token,process.env.SEC_KEY)

        const createProject=new  Project({
            projectName:req.body.projectName,
            description:req.body.description,
            adminId:tokenData.userId,

        })
        const project=await createProject.save()
        res.status(200).json({message:"A new project created!!",
            project:project
        })

    }

    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Failed to create a new project!!",
            error : err

        })
    }
})

// //invite collaborators by userId
// router.post('/inviteCollaborator/:byId/:projectId',async(req,res)=>{
//     try{
//         const token = req.headers.authorization.split(" ")[1]
//     const tokenData = jwt.verify(token,process.env.SEC_KEY)
//         const user=await User.findById(req.params.byId)
//         if(!user){
//             return res.status(500).json({
//                 error : 'User not found.....'
//             })
//         }
//         const project=await Project.findById(req.params.projectId)
//         if(!project){
//             return res.status(500).json({
//                 error : 'Project not exist....'
//             })
//         }
//         else if(tokenData.userId!=project.adminId){
//             return res.status(500).json({
//                 error : 'Only admin can invite collaborators'
//             })
//         }
//         else if(tokenData.userId==req.params.byId){
//              return res.status(400).json({
//         error:'Cannot invite yourself'
//     })
//         }

//         const isExist=project.collaborators.includes(req.params.byId)
//         if(!isExist){
//             const collaborator=new Collaborator({
//                 userId:req.params.byId,
//                 adminId:tokenData.userId,
//                 projectId:req.params.projectId,
//                 isApproved:'no'
//             })
            
//         }
//         else{
//             return res.status(500).json({
//                 error : 'Invited already'
//             })
//         }

//     }
//     catch(err){
//         res.status(500).json({
//             error:err
//         })
//     }

// })

// // APIs for approval form collaborators for invited project 
// router.post('/isAproved',async(req,res)=>{
    
// })




module.exports=router