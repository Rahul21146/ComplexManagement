const mongoose = require("mongoose");

const { Schema } = mongoose;

const tenantSchema = new Schema(
  {
    // =================================================
    // USER LOGIN ACCOUNT
    // =================================================

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },

    // =================================================
    // COMPLEX
    // =================================================

    complexId: {
      type: Schema.Types.ObjectId,
      ref: "Complex",
      required: true,
      index: true,
    },

    // =================================================
    // ROOM
    // =================================================

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
      index: true,
    },

    // =================================================
    // MOVE-IN DATE
    // =================================================

    moveInDate: {
      type: Date,
      default: null,
    },

    // =================================================
    // PERSONAL INFORMATION
    // =================================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    gender: {
      type: String,
      enum: [
        "Female",
        "Male",
        "Other",
        null,
      ],
      default: null,
    },

    // =================================================
    // EMERGENCY CONTACT
    // =================================================

    emergencyContactName: {
      type: String,
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
      trim: true,
    },

    // =================================================
    // DOCUMENTS
    // =================================================

    idProofType: {
      type: String,
      enum: [
        "Aadhaar",
        "PAN",
        "Passport",
        "Voter ID",
        "Driving Licence",
        "Other",
        null,
      ],
      default: null,
    },

    idProofNumber: {
      type: String,
      trim: true,
    },

    agreementOnFile: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Tenant", tenantSchema);