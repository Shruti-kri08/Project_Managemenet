const mongoose=require('mongoose')
const User = require('./User')

const projectSchema=new mongoose.Schema({
    projectName:{
        type:String,
        trim:true,
        required:true
    },

    description:{
        type:String,
        trim:true,
        required:true
    },

    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    collaborators:[{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    tasks:[{
        type:String,

    }],

    status:{
    type:String,
    enum:[
        'Pending',
        'In Progress',
        'Completed'
    ],
    default:'Pending'
}

},{
    timestamps:true
    
})

module.exports=mongoose.model('Project',projectSchema)