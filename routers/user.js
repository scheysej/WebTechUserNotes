const express = require('express')
const User = require('../models/user.js')
const Note = require('../models/note.js')

const router = express.Router()

router.get('/user',async (req,res)=>{
    try{
        const allUsers = await User.find({})
        res.send(allUsers)
    }catch(err){
        res.send(err)
    }   
})

router.post('/user',async (req,res)=>{
    const u = new User({name:req.body.name,email:req.body.email})
    const user = await u.save()
    res.send(user)
    //do app.use to read json data
})

router.get('/user/:name',async (req,res)=>{
    try{
        /* v1
        const user = await User.findOne({name:req.params.name})
        if(!user)
            res.send("User not found")
        else{
            const userNotes = await Note.find({author:user._id})
            const result = user.toObject()
            result.notes = userNotes
            res.send(result)
        }
        */
       /*v2*/
       const user = await User.findOne({name:req.params.name}).populate('notes').exec()
       res.send(user)

        
    }catch(err){
        res.send(err)
    }
})

router.delete('/user',async (req,res)=>{
    try{
        /* v1 
        const result = await User.deleteOne({name:req.body.name})
        if(result.deletedCount == 0)
            res.send("User not found...")
        else
            res.send(result)
        */
       /* v2 */
       const deletedUser = await User.findOneAndDelete({name:req.body.name})
       if(!deletedUser)
           res.send("User not found...")
       else{
        //delete user notes
        const result2 = await Note.deleteMany({author:deletedUser._id})
        console.log(result2)
        res.send(deletedUser)
       }
           
    }catch(err){
        res.send(err)
    }
})

router.patch('/user',async (req,res)=>{
    try{
        const result = await User.updateOne({name:req.body.name},{email:req.body.email})
        res.send(result)
    }catch(err){
        res.send(err)
    }
})

module.exports = router