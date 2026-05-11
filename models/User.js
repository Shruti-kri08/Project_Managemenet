const mongoose=require('mongoose')



const userSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    imageUrl:{
        type:String,
    },
    imageId:{
        type:String,
    },
    createdProjects:[{
        type:mongoose.Schema.Types.ObjectId,
         ref:'Project',
    }],
    collaboratedProjects:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Project',
    }]
})
module.exports=mongoose.model('User',userSchema)