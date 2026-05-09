const express = require('express')
const Router = express()
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')


cloudinary.config({
    cloud_name : " ",
    api_key : " ",
    api_secret : " "
})

// signup api 
Router.post('/signup',async(req,res)=>{
    try
    {
        const user = await user.find({email : req.body.email})
        if(user.length > 0)
        {
            return res.status(500).json({
                error : "Email is already registered......"
            })
        }

        const uploadProfile = await cloudinary.uploader.upload(req.files.tempFilePath)
        const hash = await bcrypt.hash(req.body.password)
        const newUser = ({
            fullName : req.body.fullName,
            email : req.body.email,
            password : hash,
            profilePic : req.files.profilePic
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(200).json({
            error : err
        })
    }
})


module.exports = Router