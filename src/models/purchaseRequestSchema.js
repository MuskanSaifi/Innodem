import mongoose from "mongoose";

const purchaseRequestSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    required: true,
  },
  approxOrderValue: {
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['INR', 'USD', 'AED'], default: 'INR' },
  },
  requirementFrequency: {
    type: String,
    enum: ['one-time', 'recurring'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.models.PurchaseRequest || mongoose.model("PurchaseRequest", purchaseRequestSchema);



