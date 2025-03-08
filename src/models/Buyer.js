import mongoose from "mongoose";

const BuyerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobileNumber: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true },
    pincode: { type: String },
    interestedProducts: [{ type: String }], // Array of products they want to buy
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Buyer || mongoose.model("Buyer", BuyerSchema);
