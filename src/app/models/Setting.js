import mongoose from 'mongoose';

const TaxRateSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  rate: {
    type: Number,
    required: true,
    default: 0,
  },
});

const SettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  taxRates: [TaxRateSchema],
  defaultLetterhead: {
    type: String,
  },
  defaultFooter: {
    type: String,
  },
  // Invoice numbering settings
  invoiceSequence: {
    type: Number,
    default: 0,
  },
  invoicePrefix: {
    type: String,
    default: 'INV-',
    trim: true,
  },
  // Example: "PREFIX-YYYY-{SEQ}" or "PREFIX-YY-{SEQ}" or "PREFIX-{SEQ}"
  // {YYYY} = 4-digit year, {YY} = 2-digit year, {SEQ} = sequence number
  invoiceNumberFormat: {
    type: String,
    default: '{PREFIX}{YYYY}-{SEQ}', 
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
