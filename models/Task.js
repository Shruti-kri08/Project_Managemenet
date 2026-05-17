const mongoose=require('mongoose')
const Project = require('./Project')
const taskSchema=mongoose.Schema({
    task:{type:String,required:true,tirm:true},
    description:{type:String,requried:true,trim:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'Project'},
    assignTo:[{type:mongoose.Schema.Types.ObjectId ,ref:'Project'} ],
    imageUrl:{type:String,required:true},
    imageId:{type:String,required:true},    
    status:{type:String,required:true,tirm:true ,default:"not started yet"},   

})
module.exports=mongoose.model('Task',taskSchema)