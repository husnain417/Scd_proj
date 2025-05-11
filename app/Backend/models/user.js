const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type:  String,
            required: true
        },
        email: {
            type:  String,
            required: true
        },
        password: {
            type:  String,
            required: true
        },
        otp: {
            type: String, 
          },
        otpExpires: {
            type: Date, 
        },
        isVerified: {
            type: Boolean,
            default: false, 
        },
        profilePicUrl: {
            type: String,
            required: false
          },
          uploadedAt: {
            type: Date,
            default: Date.now
          }
    }
    ,{timestamps: true}
)

const User = mongoose.model('User', userSchema );
module.exports = User;