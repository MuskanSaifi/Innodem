// models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, default: "Objectionable content" },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", reportSchema);
