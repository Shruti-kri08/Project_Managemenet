const express=require('express')
const router=express.Router()

router.post('/signup',async(req,res)=>{
    try{
        res.json({msg:"hi"})
    }
    catch(err){
        console.log(err);
                res.json({error:err})

    }

})







module.exports=router