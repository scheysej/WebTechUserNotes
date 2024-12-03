const express = require('express')
const Note = require('../models/note.js')

const router = express.Router()

router.post('/note',async (req,res)=>{
    const newNote = new Note(req.body)
    const note = await newNote.save()
    res.send(note)

})

router.get('/note',async (req,res)=>{
    const notes = await Note.find({})
    res.send(notes)
})

router.delete('/note', async(req,res)=>{
    const result = await Note.deleteOne({title:req.body.title})
    res.send(result)
})

module.exports = router