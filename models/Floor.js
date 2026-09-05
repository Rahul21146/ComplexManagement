const mongoose = require('mongoose');
const { Schema } = mongoose;

const floorSchema = new Schema(
  {
    complexId: { type: Schema.Types.ObjectId, ref: 'Complex', required: true, index: true },
    name: { type: String, required: true, trim: true }, // e.g. "Floor 1"
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Floor', floorSchema);
