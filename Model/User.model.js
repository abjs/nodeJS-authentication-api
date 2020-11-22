const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    }
});
userSchema.pre('save', async function (next) {
    try {
        // console.log("Bf Save")
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(this.password ,salt);
        this.password = hashedpassword;

    } catch (error) {
        next(error)
    }
})
userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}



// userSchema.post('save', async function (next) {
//     try {
//         console.log(" Date Saved")

//     } catch (error) {
//         next(error)
//    
// })






const User = mongoose.model('User', userSchema);
module.exports = User