const mongoose = require("mongoose");

const { Schema } = mongoose;

const complexSchema = new Schema(
    {
        ownerUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        pinCode: {
            type: String,
            required: true,
            trim: true
        },

        country: {
            type: String,
            default: "India",
            trim: true
        },

        contactNumber: {
            type: String,
            trim: true
        },

        contactEmail: {
            type: String,
            trim: true,
            lowercase: true
        },

        emergencyContact: {
            type: String,
            trim: true
        },

        // Active / inactive status
        isActive: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complex", complexSchema);