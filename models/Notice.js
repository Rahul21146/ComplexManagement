const mongoose = require('mongoose');
const { Schema } = mongoose;

const noticeSchema = new Schema(
  {
    complexId: { type: Schema.Types.ObjectId, ref: 'Complex', required: true, index: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
