const mongoose=require('mongoose')
const collaboratorSchema=new mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },

        adminId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },

        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Project'
        },
        isApproved:{
            type: String,
             enum: [
                'Yes',
                'No'
             ],
             required:true
        }     

},
{
    timestamps:'true'
})
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

},{
    timestamps:true
    
})

module.exports=mongoose.model('Project',projectSchema)