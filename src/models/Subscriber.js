import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    }
  },
  { timestamps: true }
);

// ✅ Ensure model is not re-registered
const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
export default Subscriber;
