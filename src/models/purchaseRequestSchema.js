import mongoose from "mongoose";

const purchaseRequestSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer', // Buyer model ka reference
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Seller model ka reference
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
    enum: ['one-time', 'recurring'], // Either 'one-time' or 'recurring'
    required: true,
  },

},  { timestamps: true }
);

export default mongoose.models.PurchaseRequest || mongoose.model("PurchaseRequest", purchaseRequestSchema);



