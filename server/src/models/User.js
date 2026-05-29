import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    phone: { type: Boolean, default: false },
    identity: { type: Boolean, default: false },
    faceMatch: { type: Boolean, default: false },
    address: { type: Boolean, default: false }
  },
  { _id: false }
);

const reputationSchema = new mongoose.Schema(
  {
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    trustScore: { type: Number, default: 60 },
    successfulDeals: { type: Number, default: 0 },
    unresolvedReports: { type: Number, default: 0 },
    badge: { type: String, enum: ["new", "verified", "trusted", "elite"], default: "new" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, index: true },
    displayName: String,
    avatarUrl: String,
    location: {
      label: String,
      point: {
        type: { type: String, enum: ["Point"] },
        coordinates: {
          type: [Number],
          validate: {
            validator(value) {
              return !value || value.length === 0 || (value.length === 2 && value.every((item) => typeof item === "number"));
            },
            message: "Location coordinates must be [longitude, latitude]"
          }
        }
      }
    },
    roles: { type: [String], default: ["buyer", "seller"] },
    verification: { type: verificationSchema, default: () => ({}) },
    reputation: { type: reputationSchema, default: () => ({}) },
    notificationTokens: [String],
    interests: {
      categories: [String],
      cities: [String],
      keywords: [String]
    },
    contactPreferences: {
      showPhone: { type: Boolean, default: false },
      allowWhatsapp: { type: Boolean, default: true },
      inAppChat: { type: Boolean, default: true }
    },
    status: { type: String, enum: ["active", "suspended", "under_review"], default: "active" }
  },
  { timestamps: true }
);

userSchema.virtual("isVerified").get(function isVerified() {
  return Boolean(this.verification?.phone && (this.verification?.identity || this.verification?.faceMatch));
});

userSchema.pre("save", function removeEmptyLocation(next) {
  if (this.location?.point?.coordinates?.length === 0) {
    this.location.point = undefined;
  }
  next();
});


export const User = mongoose.model("User", userSchema);
