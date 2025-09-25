import mongoose from "mongoose";

const blockedUserSchema = new mongoose.Schema(
  {
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jisne block kiya
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // seller jo block hua
  },
  { timestamps: true }
);

export default mongoose.models.BlockedUser || mongoose.model("BlockedUser", blockedUserSchema);
