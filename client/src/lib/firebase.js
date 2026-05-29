const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const isFirebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);
const sdkVersion = "11.10.0";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export async function getFirebaseAuth() {
  if (!isFirebaseReady) throw new Error("Firebase is not configured");

  await loadScript(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-app-compat.js`);
  await loadScript(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-auth-compat.js`);

  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }

  return window.firebase.auth();
}

export function watchAuthState(callback) {
  if (!isFirebaseReady || typeof window === "undefined") return () => {};

  let unsubscribe = () => {};
  getFirebaseAuth()
    .then((auth) => {
      unsubscribe = auth.onAuthStateChanged(callback);
    })
    .catch(() => callback(null));

  return () => unsubscribe();
}

export async function ensureRecaptcha(containerId = "firebase-recaptcha") {
  const auth = await getFirebaseAuth();

  if (window.trustloopRecaptchaVerifier) {
    window.trustloopRecaptchaVerifier.clear();
  }

  window.trustloopRecaptchaVerifier = new window.firebase.auth.RecaptchaVerifier(containerId, {
    size: "invisible"
  });

  await window.trustloopRecaptchaVerifier.render();
  return window.trustloopRecaptchaVerifier;
}

export async function sendPhoneOtp(phoneNumber) {
  const auth = await getFirebaseAuth();
  const verifier = await ensureRecaptcha();
  return auth.signInWithPhoneNumber(phoneNumber, verifier);
}

export async function confirmPhoneOtp(confirmationResult, otp) {
  return confirmationResult.confirm(otp);
}

export async function logoutFirebaseUser() {
  const auth = await getFirebaseAuth();
  await auth.signOut();
}
