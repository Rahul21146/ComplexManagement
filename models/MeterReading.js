const mongoose = require('mongoose');
const { Schema } = mongoose;

const meterReadingSchema = new Schema(
  {
    tenancyId: { type: Schema.Types.ObjectId, ref: 'Tenancy', required: true, index: true },
    meterType: { type: String, enum: ['Electricity', 'Water'], required: true },
    billingMonth: { type: Date, required: true },
    prevReading: { type: Number, required: true },
    currReading: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= this.prevReading;
        },
        message: 'currReading must be greater than or equal to prevReading',
      },
    },
    ratePerUnit: { type: Number, required: true },
    unit: { type: String, required: true, trim: true }, // e.g. "kWh", "kL"
    billAmount: { type: Number }, // computed automatically in the pre-save hook below
    status: { type: String, enum: ['paid', 'due'], default: 'due' },
  },
  { timestamps: true }
);

meterReadingSchema.index({ tenancyId: 1, billingMonth: 1 });

// Mirrors the GENERATED ALWAYS AS column in the SQL version.
meterReadingSchema.pre('save', function (next) {
  this.billAmount = (this.currReading - this.prevReading) * this.ratePerUnit;
  next();
});

module.exports = mongoose.model('MeterReading', meterReadingSchema);
