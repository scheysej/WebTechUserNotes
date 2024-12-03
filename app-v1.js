const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}));
app.use( express.static(path.join(__dirname, "public")));
app.use(express.json()) // parses incoming JSON requests and puts the parsed data in req.body







app.listen(3000,()=>{
    console.log("Server started on Port 3000")
})



const url = "YOUR URL HERE"

mongoose.connect(url,(err)=>{
    if(err)
        console.log("Error connecting to cluster")
    else
        console.log("Connected...")
})

const UserSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true}
    
})
UserSchema.virtual('notes',{
    ref:'Note',
    localField: '_id',
    foreignField: 'author'
})

UserSchema.set('toJSON',{virtuals:true})
UserSchema.set('toObject',{virtuals:true})

const User = mongoose.model("User",UserSchema,"users")


const NoteSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const Note = mongoose.model("Note",NoteSchema,"notes")

// const testNote = new Note({
//     title:"foo",
//     description:"bar",
//     author: "67463d0ba36d36b7f713650f"
// })
// testNote.save()

// const testUser = new User({name:"John",email:"j@j.com"})
// testUser.save()

app.get('/user',async (req,res)=>{
    try{
        const allUsers = await User.find({})
        res.send(allUsers)
    }catch(err){
        res.send(err)
    }   
})

app.post('/user',async (req,res)=>{
    const u = new User({name:req.body.name,email:req.body.email})
    const user = await u.save()
    res.send(user)
    //do app.use to read json data
})

app.get('/user/:name',async (req,res)=>{
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

app.delete('/user',async (req,res)=>{
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

app.patch('/user',async (req,res)=>{
    try{
        const result = await User.updateOne({name:req.body.name},{email:req.body.email})
        res.send(result)
    }catch(err){
        res.send(err)
    }
})

app.post('/note',async (req,res)=>{
    const newNote = new Note(req.body)
    const note = await newNote.save()
    res.send(note)

})

app.get('/note',async (req,res)=>{
    const notes = await Note.find({})
    res.send(notes)
})

app.delete('/note', async(req,res)=>{
    const result = await Note.deleteOne({title:req.body.title})
    res.send(result)
})




app.get('/',(req,res)=>{
    res.render('index')
})