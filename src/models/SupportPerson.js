import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const supportPersonSchema = new mongoose.Schema({
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  name: String,
  number: String,
  email: { type: String, unique: true },
  password: String,
}, {
  timestamps: true,
});

// Hash password before saving
supportPersonSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// For login comparison
supportPersonSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.SupportPerson || mongoose.model("SupportPerson", supportPersonSchema);
