require('dotenv').config()
const express = require('express')
const router = express.router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const User=require('../models/User')
const Project=require('../models/Project')










module.exports=router