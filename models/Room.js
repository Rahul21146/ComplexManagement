const mongoose = require("mongoose");

const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    // ================================================
    // COMPLEX
    // ================================================

    complexId: {
      type: Schema.Types.ObjectId,
      ref: "Complex",
      required: true,
      index: true,
    },

    // ================================================
    // FLOOR
    // ================================================

    floorId: {
      type: Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
      index: true,
    },

    // ================================================
    // ROOM DETAILS
    // ================================================

    number: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    areaSqft: {
      type: Number,
      required: true,
      min: 0,
    },

    // ================================================
    // RENT DETAILS
    // ================================================

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    securityDeposit: {
      type: Number,
      required: true,
      min: 0,
    },

    // ================================================
    // OCCUPANCY
    // ================================================

    status: {
      type: String,
      enum: ["vacant", "occupied"],
      default: "vacant",
      index: true,
    },

    // ================================================
    // METER DETAILS
    // ================================================

    electricityMeterNumber: {
      type: String,
      trim: true,
    },

    waterMeterNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ====================================================
// UNIQUE ROOM NUMBER INSIDE A FLOOR
// ====================================================

roomSchema.index(
  {
    floorId: 1,
    number: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);