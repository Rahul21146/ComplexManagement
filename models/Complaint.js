const mongoose = require('mongoose');
const { Schema } = mongoose;

const complaintSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Plumbing', 'Electrical', 'Security', 'Other'], required: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' },
    raisedDate: { type: Date, default: Date.now },
    resolvedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
