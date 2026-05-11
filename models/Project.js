const mongoose=require('mongoose')

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

    projectAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    collaborators:[{
         type:mongoose.Schema.Types.ObjectId,
        ref:'Collaborator'
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