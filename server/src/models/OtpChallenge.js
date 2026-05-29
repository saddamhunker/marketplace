import mongoose from "mongoose";

const otpChallengeSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    consumedAt: Date,
    requestIp: String
  },
  { timestamps: true }
);

otpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpChallenge = mongoose.model("OtpChallenge", otpChallengeSchema);
