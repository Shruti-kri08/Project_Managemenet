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
const { json } = require('body-parser')


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


//Delete project (by Admin only)
router.delete('/delete/:projectId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        const project = await Project.findById(req.params.projectId)
        if (!project) {
            return res.status(500).json({ message: "project not found!!" })
        }
        if (project.adminId.toString() !== tokenData.userId) {
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

//APIs to get all Admin-projects
router.get('/my-projects',async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
    const tokenData = jwt.verify(token, process.env.SEC_KEY)
    const myProjects=await Project.find({adminId:tokenData.userId})
    if(myProjects.length==0){
        return res.status(500).json({mesasge:"No projects created!"})
    }
    res.status(200).json({myProjects:myProjects})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err})
        
    }
})
//Get all collaborated-projects
router.get('/collaborated-projects', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        const collaboratedProjects = await Collaborator.find({ userId: tokenData.userId  ,isApproved:'Yes'}).populate('projectId')
        if (collaboratedProjects.length == 0) {
            return res.status(400).json({
                message: "You are not collaborating on any project"
            })
        }
        res.status(200).json({ collaboratedProjects })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })

    }

})



module.exports = router