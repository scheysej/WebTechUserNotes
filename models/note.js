const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const Note = mongoose.model("Note",NoteSchema,"notes")

module.exports = Note