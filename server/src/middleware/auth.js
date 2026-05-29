import { getFirebaseAdmin } from "../config/firebase.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Missing auth token" });

    const firebaseUser = await getFirebaseAdmin().auth().verifyIdToken(token);
    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUser.uid },
      {
        $setOnInsert: {
          firebaseUid: firebaseUser.uid,
          phoneNumber: firebaseUser.phone_number,
          verification: { phone: true }
        }
      },
      { upsert: true, new: true }
    );

    req.user = user;
    req.firebaseUser = firebaseUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid auth token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user?.roles?.includes("admin")) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

export function requireVerifiedUser(req, res, next) {
  if (!req.user?.isVerified) {
    return res.status(403).json({ message: "Verified users only" });
  }

  next();
}
