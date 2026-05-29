const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const storageKey = "trustloop-auth-session";

export const isFirebaseReady = true;

function wrapSession(session) {
  if (!session?.token || !session?.user) return null;
  return {
    ...session.user,
    phoneNumber: session.user.phoneNumber,
    getIdToken: async () => session.token
  };
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(storageKey, JSON.stringify(session));
  window.dispatchEvent(new Event("trustloop-auth-change"));
}

export function watchAuthState(callback) {
  const emit = () => callback(wrapSession(readSession()));
  emit();
  window.addEventListener("trustloop-auth-change", emit);
  window.addEventListener("storage", emit);
  return () => {
    window.removeEventListener("trustloop-auth-change", emit);
    window.removeEventListener("storage", emit);
  };
}

export function resetRecaptcha() {
  // Custom OTP does not use Firebase reCAPTCHA.
}

export async function sendPhoneOtp(phoneNumber) {
  const response = await fetch(`${API_BASE}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "OTP request failed");
  return { phoneNumber, ...data };
}

export async function confirmPhoneOtp(confirmationResult, otp) {
  const response = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber: confirmationResult.phoneNumber, otp })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "OTP verification failed");
  saveSession(data);
  return data;
}

export async function logoutFirebaseUser() {
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event("trustloop-auth-change"));
}
