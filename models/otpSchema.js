const mongoose = require("mongoose");

const { Schema } = mongoose;

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        otp: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OTP", otpSchema);