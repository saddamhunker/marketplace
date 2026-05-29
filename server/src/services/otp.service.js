import crypto from "node:crypto";

const otpSecret = process.env.OTP_SECRET || process.env.JWT_SECRET || "trustloop-otp-secret";

export function normalizePhoneNumber(phoneNumber) {
  const trimmed = String(phoneNumber || "").replace(/\s+/g, "");
  if (!/^\+[1-9]\d{9,14}$/.test(trimmed)) {
    throw new Error("Use international phone format, for example +919876543210");
  }
  return trimmed;
}

export function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

export function hashOtp(phoneNumber, otp) {
  return crypto.createHmac("sha256", otpSecret).update(`${phoneNumber}:${otp}`).digest("hex");
}

export async function sendOtpSms(phoneNumber, otp) {
  const provider = (process.env.CUSTOM_OTP_PROVIDER || "console").toLowerCase();
  const nationalPhone = phoneNumber.replace(/^\+91/, "").replace(/^\+/, "");

  if (provider === "2factor" && process.env.TWO_FACTOR_API_KEY) {
    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${nationalPhone}/${otp}/TrustLoop`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("2Factor OTP SMS failed");
    return { provider: "2factor" };
  }

  if (provider === "fast2sms" && process.env.FAST2SMS_API_KEY) {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: nationalPhone
      })
    });
    if (!response.ok) throw new Error("Fast2SMS OTP SMS failed");
    return { provider: "fast2sms" };
  }

  console.log(`TrustLoop OTP for ${phoneNumber}: ${otp}`);
  return { provider: "console", devOtp: otp };
}
