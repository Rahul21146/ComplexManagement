const mongoose = require('mongoose');
const { Schema } = mongoose;

const visitorSchema = new Schema(
  {
    complexId: { type: Schema.Types.ObjectId, ref: 'Complex', required: true, index: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', default: null, index: true }, // null = not tied to a specific unit
    visitorName: { type: String, required: true, trim: true },
    purpose: { type: String, trim: true }, // e.g. courier, guest, electrician
    inTime: { type: String, required: true }, // e.g. "09:12 AM" — use Date if you need real time-zone math
    outTime: { type: String, default: null }, // null while the visitor is still on-site
    visitDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', visitorSchema);
