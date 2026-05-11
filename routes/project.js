require('dotenv').config()
const express = require('express')
const router = express.router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const User=require('../models/User')
const Project=require('../models/Project')

// send collaborator request api
Router.Post('/send-request/:userId',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const user = await User.find(req.params.userId)
        if(!user)
        {
            return res.status(500).json({
                error : 'User not found.....'
            })
        }

        const adminId = await User.find(tokenData.userId)
        if(req.params.userId == tokenData.userId)
        {
            return res.status(500).json({
                error : 'Admin-Id..'
            })
        }

        
       
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error : err
        })
    }
})








module.exports=router