import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { OtpChallenge } from "../models/OtpChallenge.js";
import { User } from "../models/User.js";
import { createAuthToken } from "../services/token.service.js";
import { generateOtp, hashOtp, normalizePhoneNumber, sendOtpSms } from "../services/otp.service.js";

const router = Router();
const otpTtlMinutes = 5;

router.post("/request-otp", async (req, res) => {
  try {
    const phoneNumber = normalizePhoneNumber(req.body.phoneNumber);
    const recentCount = await OtpChallenge.countDocuments({
      phoneNumber,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
    });

    if (recentCount >= 4) {
      return res.status(429).json({ message: "Too many OTP requests. Try again after 10 minutes." });
    }

    const otp = generateOtp();
    await OtpChallenge.create({
      phoneNumber,
      otpHash: hashOtp(phoneNumber, otp),
      expiresAt: new Date(Date.now() + otpTtlMinutes * 60 * 1000),
      requestIp: req.ip
    });

    const sms = await sendOtpSms(phoneNumber, otp);
    res.json({
      message: "OTP sent",
      provider: sms.provider,
      expiresInSeconds: otpTtlMinutes * 60,
      ...(process.env.CUSTOM_OTP_DEV_MODE === "true" && sms.devOtp ? { devOtp: sms.devOtp } : {})
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "OTP request failed" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const phoneNumber = normalizePhoneNumber(req.body.phoneNumber);
    const otp = String(req.body.otp || "").trim();
    if (!/^\d{6}$/.test(otp)) return res.status(400).json({ message: "Enter a valid 6 digit OTP" });

    const challenge = await OtpChallenge.findOne({
      phoneNumber,
      consumedAt: { $exists: false },
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!challenge) return res.status(400).json({ message: "OTP expired. Request a new OTP." });
    if (challenge.attempts >= 5) return res.status(429).json({ message: "Too many wrong attempts. Request a new OTP." });

    const valid = challenge.otpHash === hashOtp(phoneNumber, otp);
    if (!valid) {
      challenge.attempts += 1;
      await challenge.save();
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    challenge.consumedAt = new Date();
    await challenge.save();

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      {
        $set: { phoneNumber, "verification.phone": true, status: "active" },
        $setOnInsert: { firebaseUid: `phone:${phoneNumber}`, roles: ["buyer", "seller"] }
      },
      { upsert: true, new: true }
    );

    await User.updateOne({ _id: user._id, "location.point.coordinates": { $size: 0 } }, { $unset: { "location.point": "" } });
    const cleanUser = await User.findById(user._id);
    const token = createAuthToken({ sub: String(user._id), phoneNumber });
    res.json({ token, user: cleanUser });
  } catch (error) {
    res.status(400).json({ message: error.message || "OTP verification failed" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/profile", requireAuth, async (req, res) => {
  const allowed = ["displayName", "avatarUrl", "location", "contactPreferences", "interests"];
  for (const field of allowed) {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  }

  await req.user.save();
  res.json({ user: req.user });
});

export default router;
