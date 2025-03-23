import mongoose from "mongoose";

const BuyerSchema = new mongoose.Schema({
  fullname: { type: String},
  email: { type: String},
  mobileNumber: { type: String, required: true, unique: true },
  countryCode: { type: String, required: true },
  productname: { type: String, required: true },
  otp: { type: Number },
  otpExpires: { type: Date },
},
{ timestamps: true }
);

const Buyer = mongoose.models.Buyer || mongoose.model("Buyer", BuyerSchema);

export default Buyer;
