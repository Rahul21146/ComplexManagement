const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    floorId: { type: Schema.Types.ObjectId, ref: 'Floor', required: true, index: true },
    number: { type: String, required: true, trim: true }, // e.g. "101"
    type: { type: String, trim: true }, // e.g. "1BHK", "2BHK"
    areaSqft: { type: Number },
    monthlyRent: { type: Number, required: true },
    electricityMeterNumber: { type: String, trim: true },
    waterMeterNumber: { type: String, trim: true },
    status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
    // Denormalised for fast reads — keep in sync whenever a tenancy starts/ends.
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
