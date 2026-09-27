const mongoose = require("mongoose");

const { Schema } = mongoose;

const rentPaymentSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    // Always store the first day of the month
    billingMonth: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["paid", "due"],
      default: "due",
      index: true,
    },

    paidOn: {
      type: Date,
      default: null,
    },

    method: {
      type: String,
      enum: [
        "UPI",
        "Card",
        "Net Banking",
        "Cash",
        "Other",
        null,
      ],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate rent for same tenant + month
rentPaymentSchema.index(
  {
    tenantId: 1,
    billingMonth: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "RentPayment",
  rentPaymentSchema
);