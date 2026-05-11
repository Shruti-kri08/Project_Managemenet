require('dotenv').config()
const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const User=require('../models/User')



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})


// signup api 
Router.post('/signup',async(req,res)=>{
    try
    {
        const data=await User.find({email:req.body.email})
        if(data.length > 0)
        {
            return res.status(500).json({
                error : "Email is already registered......"
            })
        }

        const uploadImage = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
            resource_type:"image",
            folder:"project-management/profile-images"
        })
        const hash = await bcrypt.hash(req.body.password,10)
        const newUser = new User({
            fullName : req.body.fullName,
            email : req.body.email,
            password : hash,
            imageId:uploadImage.public_id,
            imageUrl:uploadImage.secure_url
        })
       const result= await newUser.save()
       res.status(200).json({User:result})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error : err
        })
    }
})

//login api
Router.post('/login',async(req,res)=>{
  try{
    const user= await User.find({email:req.body.email})
  if(user.length==0){
    return res.status(500).json({mgs:"email not registered"})

  }
  const isMatch=await bcrypt.compare(req.body.password,user[0].password)
  if(!isMatch){
    return res.status(500).json({
        message:"Incorrect password"
    })
  }
  const token=jwt.sign({
    fullName:user[0].fullName,
    email:user[0].email
  },
  process.env.SEC_KEY,
  {
    expiresIn:'365d'
  })
  res.status(200).json({
    token:token
  })


  }
  catch(err){
    console.log(err);
    res.status(500).json({
        error:err
    })
    
  }
})


module.exports = Router