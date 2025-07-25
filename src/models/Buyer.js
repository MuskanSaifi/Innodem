import mongoose from "mongoose";

const BuyerSchema = new mongoose.Schema({
  fullname: { type: String },
  email: { type: String },
  mobileNumber: { type: String, required: true, unique: true },
  countryCode: { type: String, required: true },
  productname: { type: String},
    inquiredProducts: [{ type: String }], 

  quantity: { type: Number},
  unit: { type: String},
  orderValue: { type: Number },
  currency: { type: String},
  buyer: { type: String}, // from localStorage
  otp: { type: Number},
  otpExpires: { type: Date },
    remark: {
    type: String,
    default: ""
  },
},
{ timestamps: true }
);

const Buyer = mongoose.models.Buyer || mongoose.model("Buyer", BuyerSchema);
  
export default Buyer;
