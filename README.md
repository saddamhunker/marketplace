# TrustLoop Marketplace

A modern trusted marketplace inspired by OLX, Quikr, and Facebook Marketplace, with stronger verification, moderation, nearby alerts, seller reputation, dispute handling, and AI-assisted scam prevention.

## What Is Included

- React frontend with a premium dark responsive UI.
- Android-style mobile marketplace preview.
- Admin dashboard for approvals, disputes, reports, categories, analytics, and scam alerts.
- Express backend architecture with MongoDB/Mongoose models.
- Firebase Authentication middleware design for phone OTP users.
- Cloudinary upload service boundary.
- AI moderation service stub for fake listing, duplicate image, suspicious pricing, and spam signals.
- Geolocation helpers for nearby listing search and 5 KM notification targeting.

## Run Locally

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:8080/api/health`

Copy `server/.env.example` to `server/.env` and fill in MongoDB, Firebase Admin, Cloudinary, Maps, and push notification credentials before connecting real services.

## Production Notes

The backend is intentionally structured around clear service boundaries. The scam detection service currently uses deterministic rules so the app works locally; replace or extend it with your preferred AI moderation provider before production launch.
