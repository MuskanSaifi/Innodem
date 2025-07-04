const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userProfileSlug: String,

    supportPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupportPerson",
  },
  

  fullname: String,
  email: { type: String, unique: true },
  mobileNumber: { type: String, unique: true }, 
  icon: { type: String },
  iconPublicId: String,
    alternateMobileNumber: String, 
    alternateEmail: String, 
    whatsappNumber: String, 
    designation: String, 
    companyName: String,
    pincode: String,
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
    remark: {
    type: String,
    default: ""
  },

    // ✅ Add this line to reference products
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // 👇 User package info added here
    userPackage: [
      {
        packageName: String,
        totalAmount: { type: Number}, // make sure this exists
        paidAmount: { type: Number, default: 0 },
        remainingAmount: Number,
        packageStartDate: { type: Date, default: Date.now },
        packageExpiryDate: Date,
      }
    ],
    
      userPackageHistory: [
        {
          packageName: String,
          totalAmount: Number,
          paidAmount: Number,
          remainingAmount: Number,
          packageStartDate: Date,
          packageExpiryDate: Date,
          expiredAt: { type: Date, default: Date.now }
        }
      ],

// --- ADD THIS LINE FOR EXPO PUSH NOTIFICATIONS ---
expoPushTokens: [{ type: String }], // Array to store Expo Push Tokens
},
{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
