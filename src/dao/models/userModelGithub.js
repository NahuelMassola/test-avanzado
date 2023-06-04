const mongoose = require('mongoose')
const userCollection = ('usersGithub')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }, 
    rol: {
        type: String,
    }
} , {
    versionKey: false,
    timestamps:true
})

const userModelGithub = mongoose.model(userCollection , userSchema);

module.exports = userModelGithub;