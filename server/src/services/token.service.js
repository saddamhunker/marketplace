import crypto from "node:crypto";

const secret = process.env.JWT_SECRET || process.env.FIREBASE_PRIVATE_KEY || "trustloop-local-dev-secret";

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAuthToken(payload, expiresInSeconds = 30 * 24 * 60 * 60) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyAuthToken(token) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) throw new Error("Malformed token");

  const expected = sign(`${header}.${body}`);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Token expired");
  return payload;
}
