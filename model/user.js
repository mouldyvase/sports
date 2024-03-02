const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema(
    {
        name: {type:String, unique: false, required:true},
        email: {type:String, unique: true, required: true},
        password: {type: String, unique: true, required: true},
    }
);

const User = mongoose.model("flatmates", userSchema);

module.exports = User;