import mongoose from 'mongoose';

const pushTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
    unique: true, // A user should generally only have one active token per device/app install
  },
  token: { // The Expo Push Token
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create an index for faster lookups by userId
pushTokenSchema.index({ userId: 1 });

const PushToken = mongoose.models.PushToken || mongoose.model('PushToken', pushTokenSchema);

export default PushToken;