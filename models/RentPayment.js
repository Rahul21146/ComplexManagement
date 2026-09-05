const mongoose = require('mongoose');
const { Schema } = mongoose;

const rentPaymentSchema = new Schema(
  {
    tenancyId: { type: Schema.Types.ObjectId, ref: 'Tenancy', required: true, index: true },
    billingMonth: { type: Date, required: true }, // store as the 1st of the month, e.g. 2026-08-01
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'due'], default: 'due' },
    paidOn: { type: Date, default: null },
    method: { type: String, enum: ['UPI', 'Card', 'Net Banking', 'Cash', 'Other', null], default: null },
  },
  { timestamps: true }
);

// Speeds up the "filter by tenant + month" ledger query.
rentPaymentSchema.index({ tenancyId: 1, billingMonth: 1 });

module.exports = mongoose.model('RentPayment', rentPaymentSchema);
