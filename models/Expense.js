const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    complexId: { type: Schema.Types.ObjectId, ref: 'Complex', required: true, index: true },
    category: { type: String, enum: ['Electricity', 'Water', 'Maintenance', 'Other'], required: true },
    amount: { type: Number, required: true },
    expenseDate: { type: Date, required: true },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
