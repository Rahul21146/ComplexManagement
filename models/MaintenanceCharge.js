const mongoose = require('mongoose');
const { Schema } = mongoose;

const maintenanceChargeSchema = new Schema(
  {
    tenancyId: { type: Schema.Types.ObjectId, ref: 'Tenancy', required: true, index: true },
    billingMonth: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'due'], default: 'due' },
    paidOn: { type: Date, default: null },
  },
  { timestamps: true }
);

maintenanceChargeSchema.index({ tenancyId: 1, billingMonth: 1 });

module.exports = mongoose.model('MaintenanceCharge', maintenanceChargeSchema);
