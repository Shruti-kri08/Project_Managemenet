require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Project = require('../models/Project')
const Collaborator = require('../models/Collaborator')


//create project
router.post('/create', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)

        const createProject = new Project({
            projectName: req.body.projectName,
            description: req.body.description,
            adminId: tokenData.userId,

        })
        const project = await createProject.save()
        res.status(200).json({
            message: "A new project created!!",
            project: project
        })

    }

    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to create a new project!!",
            error: err

        })
    }
})


//APIs for Delete project (by Admin only)
router.delete('/delete/:projectId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        const project = await Project.findById(req.params.projectId)
        if (!project) {
            return res.status(500).json({ message: "project not found!!" })
        }
        if (project.adminId.toString()  !== tokenData.userId) {
            return res.status(500).json({
                message: 'Only admin can delete project'
            })
        }
        if (project.collaborators.length > 0) {
            project.collaborators.forEach(async (cId) => {
                await Collaborator.findOneAndDelete({ userId: cId, projectId: req.params.projectId })
            })

        }

        await Project.deleteOne({ _id: req.params.projectId })
        return res.status(200).json({
                message: 'Project deleted!!'
            })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to create a new project!!",
            error: err

        })
    }
})

// api for add cllaborator in a project 
router.post('/add-collaborator/:projectId', async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        
        // find user
        const reciver = await User.findById({userId})
        const email = await User.find({email:req.body.email})
        if(!email)
        {
            return res.status(500).json({
                error : 'User not found...'
            })
        }

        // find project

        const project = await Project.find(req.params.projectId)
        if(!project)
        {
            return res.status(500).json({
                error : 'Project not found....'
            })
        }
        //  check who add collaborator

        const owner = req.user.Id
        if(owner !== project.owner.userId)
        {
            return res.status(500).json({
                error : 'only owner can add collaborator.....'
            })
        }

        const alreadyCollaborator = project.collaborators.find(
            collab => collab.user == receiver._id
        )

        if(alreadyCollaborator){
            return res.status(400).json({
                success:false,
                message:"User already collaborator"
            })
        }

        // already request sent check
        const alreadyRequest = await CollaborationRequest.findOne({
            project:req.params.projectId,
            receiver:receiver._id,
            status:"pending"
        })

        if(alreadyRequest){
            return res.status(400).json({
                success:false,
                message:"Request already sent"
            })
        }

        // create request
        const request = await CollaborationRequest.create({
            project:req.params.projectId,
            owner:ownerId,
            receiver:receiver._id,
            role:req.body.role,
        })
        res.status(200).json({
            msg : 'Request sent successfully'
        })

     } 

     catch(err)
     {
        console.log(err)
        res.status(500).json({
          error : err
           
        })
     }

    })    


    // update project by owner
   router.put('/updateProject/:projectId', async(req,res)=>{
    try{

        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token , process.env.SEC_KEY)

        // checking project exist or not
        const project = await Project.findById(req.params.projectId)

        if(!project){
            return res.status(500).json({
                message:"project not exist"
            })
        }

        // checking owner
        if(project.owner != tokenData.userId){
            return res.status(500).json({
                message:"only owner can update project"
            })
        }

        // update 
        const newProject = ({
            projectName : req.body.projectName,
            description : req.body.description,
            status : req.bosy.status
        })

        
        // remove collaborator
        if(req.body.removeCollaboratorId){

            project.collaborators = project.collaborators.filter(cId=>{
                return cId != req.body.removeCollaboratorId
            })

            await Collaborator.deleteOne({
                userId:req.body.removeCollaboratorId,
                projectId:req.params.projectId
            })
        }

        // update assigned task
        if(req.body.taskId){

            const task = await task.findById(req.body.taskId)

            if(task){

                // update task title
                if(req.body.taskTitle){
                    task.title = req.body.taskTitle
                }

                // update task description
                if(req.body.taskDescription){
                    task.description = req.body.taskDescription
                }

                // update task status
                if(req.body.taskStatus){
                    task.status = req.body.taskStatus
                }

                // update assigned collaborator
                if(req.body.assignTo){
                    task.assignTo = req.body.assignTo
                }

                await task.save()
            }
        }

        await project.save()

        res.status(200).json({
            message:"project updated successfully",
            project:project
        })

    }
    catch(error)
    {

        res.status(500).json({
            message:error.message
        })
    }
})
    



module.exports = router