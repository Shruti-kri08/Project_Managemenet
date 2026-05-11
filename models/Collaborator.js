const  mongoose = require("mongoose")

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
    timestamps:true
})

module.exports=mongoose.model('Collaborator',collaboratorSchema)