const mongoose=require('mongoose')
const bcrypt = require('bcrypt');

const schema=mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email cannot be empty"],
        unique:true
    },
    password:{
        type: String,
        required:[true,"Must enter password"],
        minLength:6
    }
})
schema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // If the password field isn't modified, skip hashing
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (error) {
        next(error);
    }
});
module.exports=mongoose.model('hotel',schema);