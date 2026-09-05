const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    complexId: { type: Schema.Types.ObjectId, ref: 'Complex', required: true, index: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', default: null, index: true }, // null = complex-level document
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true }, // path in object storage (S3/GCS) — not the file itself
    documentType: { type: String, trim: true }, // e.g. "Rental Agreement", "ID Proof", "Certificate"
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Mongoose model name "Document" would collide with nothing here, but note:
// avoid naming a model "Document" if you also import mongoose's internal
// Document class in the same file — fine in separate files like this one.
module.exports = mongoose.model('Document', documentSchema);
