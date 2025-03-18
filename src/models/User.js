const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    mobileNumber: { type: String, unique: true }, 
    alternateMobileNumber: String, 
    alternateEmail: String, 
    whatsappNumber: String, 
    designation: String, 
    companyName: String,
    pincode: String,
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
    // ✅ Add this line to reference products
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] 
},
{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
