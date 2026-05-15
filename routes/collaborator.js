require('dotenv').config()
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Collaborator = require('../models/Collaborator')
const User = require('../models/User')
const Project = require('../models/Project')

//invite collaborators by userId
router.post('/invite/:byId/:projectId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)
        const user = await User.findById(req.params.byId)
        if (!user) {
            return res.status(500).json({
                error: 'User not found.....'
            })
        }
        const project = await Project.findById(req.params.projectId)
        if (!project) {
            return res.status(500).json({
                error: 'Project not exist....'
            })
        }
        else if (tokenData.userId != project.adminId) {
            return res.status(500).json({
                error: 'Only admin can invite collaborators'
            })
        }
        else if (tokenData.userId == req.params.byId) {
            return res.status(400).json({
                error: 'Cannot invite yourself'
            })
        }

        const isExist = await Collaborator.findOne({ userId: req.params.byId, projectId: req.params.projectId })
        if (isExist) {
            return res.status(500).json({
                error: 'Invited already'
            })
        }
        const collaborator = new Collaborator({
            userId: req.params.byId,
            adminId: tokenData.userId,
            projectId: req.params.projectId,
        })
        const result = await collaborator.save()
        return res.status(200).json({

            message: 'Invitation sent successfully',

            collaborator: result

        })
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

// APIs for approval form collaborators for invited project 
router.post('/isAproved/:projectId', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.SEC_KEY)

        //checking project exist or not
        const project = await Project.findById(req.params.projectId)
        if (!project) {
            return res.status(500).json({ message: "project not exist" })
        }
        // console.log(project);
        // console.log(tokenData.userId);
        // console.log(req.params.projectId);


        const collaborator = await Collaborator.findOne({
            userId: tokenData.userId,
            projectId: req.params.projectId
        })
        // console.log(collaborator);

        if (!collaborator) {
            return res.status(500).json({ message: "not invited" })
        }
        // console.log(collaborator.isApproved);


        if (collaborator.isApproved == 'Yes') {
            await Collaborator.deleteOne({
                userId: tokenData.userId,
                projectId: req.params.projectId
            })
            project.collaborators = project.collaborators.filter(cId => {
                return cId.toString() !== tokenData.userId
            })
            await project.save()
            return res.status(200).json({ project: project })
        }

        collaborator.isApproved = 'Yes'
        project.collaborators.push(tokenData.userId)
        await collaborator.save()
        await project.save()
        res.status(200).json({ project: project })


    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            error: err

        })
    }
})





module.exports = router