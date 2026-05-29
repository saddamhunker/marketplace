import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

export async function notifyUsersNearListing(listing, io) {
  const city = listing.location?.label?.split(",")?.[0]?.trim();
  const users = await User.find({
    _id: { $ne: listing.seller },
    status: "active",
    $or: [
      { "interests.categories": listing.category },
      { "interests.cities": city },
      { "interests.keywords": { $regex: listing.title, $options: "i" } }
    ]
  }).limit(500);

  const notifications = await Notification.insertMany(
    users.map((user) => ({
      user: user._id,
      type: "nearby_listing",
      title: "New listing matching your interest",
      body: `${listing.title} matched your ${listing.category} or ${city || "city"} interest`,
      data: { listingId: listing._id, category: listing.category, city }
    }))
  );

  for (const notification of notifications) {
    io?.to(`user:${notification.user}`).emit("notification", notification);
  }

  return notifications.length;
}

export async function createUserNotification({ user, type, title, body, data, io }) {
  const notification = await Notification.create({ user, type, title, body, data });
  io?.to(`user:${user}`).emit("notification", notification);
  return notification;
}
