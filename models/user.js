const mongoose = require("mongoose")

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

module.exports = User