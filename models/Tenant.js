const mongoose = require('mongoose');
const { Schema } = mongoose;

const tenantSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true }, // optional login account
    complexId: { type: Schema.Types.ObjectId, ref: 'Complex', required: true, index: true },

    // Personal information
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    gender: { type: String, enum: ['Female', 'Male', 'Other', null], default: null },

    // Emergency contact
    emergencyContactName: { type: String, trim: true },
    emergencyContactPhone: { type: String, trim: true },

    // Documents
    idProofType: {
      type: String,
      enum: ['Aadhaar', 'PAN', 'Passport', 'Voter ID', 'Driving Licence', 'Other', null],
      default: null,
    },
    idProofNumber: { type: String, trim: true }, // consider field-level encryption — sensitive PII
    agreementOnFile: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);
