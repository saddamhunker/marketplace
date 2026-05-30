import React from "react";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  Building2,
  Camera,
  Car,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  HeartHandshake,
  Home,
  MapPin,
  PackageCheck,
  Phone,
  PlayCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Star,
  Store,
  Stethoscope,
  Utensils,
  Upload,
  Wrench,
  X
} from "lucide-react";
import {
  confirmPhoneOtp,
  isFirebaseReady,
  logoutFirebaseUser,
  resetRecaptcha,
  sendPhoneOtp,
  watchAuthState
} from "./lib/firebase.js";
import { createListing, decideListing, fetchAdminDashboard, fetchListings, fetchPendingListings, mapListingFromApi } from "./lib/api.js";

const categories = [
  { name: "Mobiles", icon: Smartphone, count: "8.4k", proof: "IMEI, bill, battery health, repair history" },
  { name: "Cars", icon: Car, count: "2.1k", proof: "RC, insurance, owner count, service record" },
  { name: "Bikes", icon: PackageCheck, count: "3.7k", proof: "RC, insurance, engine condition, service proof" },
  { name: "Properties", icon: Home, count: "1.2k", proof: "ownership docs, map pin, tax receipt, site visit" },
  { name: "Furniture", icon: Store, count: "970", proof: "real photos, material, age, pickup location" }
];

const categoryVerificationFields = {
  Mobiles: ["Brand and model", "IMEI status", "Bill/box available", "Battery health", "Repair history"],
  Cars: ["Registration number", "RC status", "Insurance validity", "Owner count", "Service history"],
  Bikes: ["Registration number", "RC status", "Insurance validity", "Engine condition", "Service proof"],
  Properties: ["Ownership document", "Exact location", "Plot/build-up area", "Tax receipt", "Site visit availability"],
  Furniture: ["Material", "Age", "Condition", "Pickup location", "Original photos"]
};

const demoListings = [
  {
    title: "iPhone 15 Pro, bill and IMEI verified",
    category: "Mobiles",
    price: "₹82,000",
    location: "Kochi",
    interest: "142 interested",
    score: 98,
    rating: 4.9,
    expires: "05:42:18",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
    tags: ["IMEI checked", "Bill verified", "No duplicate image"]
  },
  {
    title: "2021 Honda Activa, RC and insurance checked",
    category: "Bikes",
    price: "₹62,500",
    location: "Ernakulam",
    interest: "88 interested",
    score: 94,
    rating: 4.8,
    expires: "12:10:06",
    image:
      "https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=900&q=80",
    tags: ["RC checked", "Seller trusted", "Fair price"]
  },
  {
    title: "Hyundai i20 Sportz, service record attached",
    category: "Cars",
    price: "₹6,25,000",
    location: "Kakkanad",
    interest: "61 interested",
    score: 92,
    rating: 4.7,
    expires: "08:20:15",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80",
    tags: ["RC verified", "Insurance valid", "No accident claim"]
  },
  {
    title: "2 BHK apartment with ownership docs",
    category: "Properties",
    price: "₹42,00,000",
    location: "Aluva",
    interest: "39 interested",
    score: 91,
    rating: 4.7,
    expires: "23:33:41",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    tags: ["Owner KYC", "Docs attached", "Map verified"]
  },
  {
    title: "Teak wood dining table, real photos verified",
    category: "Furniture",
    price: "₹18,500",
    location: "Panampilly Nagar",
    interest: "24 interested",
    score: 89,
    rating: 4.6,
    expires: "16:45:22",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    tags: ["Photo verified", "Pickup checked", "Condition disclosed"]
  }
];


const platformModules = [
  {
    title: "Buy / Sell Marketplace",
    body: "Mobiles, cars, bikes, properties, furniture, plots, and daily-use products with admin approval.",
    icon: Store,
    stat: "Products"
  },
  {
    title: "Local Shop & Business",
    body: "Hotels, restaurants, hospitals, shops, plots, offices, and local businesses can create profiles.",
    icon: Building2,
    stat: "Businesses"
  },
  {
    title: "Worker Listing",
    body: "Electrician, plumber, mechanic, carpenter, painter, labour, driver, and other worker profiles.",
    icon: Wrench,
    stat: "Workers"
  }
];

const businessListings = [
  {
    name: "Green Leaf Restaurant",
    type: "Restaurant",
    location: "Kochi",
    rating: "4.8",
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    tags: ["Family dining", "Verified owner", "Open today"]
  },
  {
    name: "CarePlus Hospital",
    type: "Hospital",
    location: "Ernakulam",
    rating: "4.7",
    icon: Stethoscope,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    tags: ["Emergency", "Doctor profile", "Phone verified"]
  },
  {
    name: "Airport Road Plot",
    type: "Plot / Property",
    location: "Aluva",
    rating: "Docs",
    icon: Home,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
    tags: ["Owner listed", "Map location", "Documents ready"]
  }
];

const workerProfiles = [
  {
    name: "Rafiq Ansari",
    role: "Electrician",
    city: "Kakkanad",
    rating: "4.9",
    jobs: "186 jobs",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
    skills: ["Wiring", "Inverter", "Emergency visit"]
  },
  {
    name: "Sameer Khan",
    role: "AC / Fridge Repair",
    city: "Kochi",
    rating: "4.8",
    jobs: "122 jobs",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
    skills: ["AC service", "Cooling issue", "Gas refill"]
  },
  {
    name: "Anil Kumar",
    role: "Carpenter",
    city: "Ernakulam",
    rating: "4.7",
    jobs: "98 jobs",
    image: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=900&q=80",
    skills: ["Furniture", "Door repair", "Interior"]
  }
];

const latestFeed = [
  {
    author: "Rafiq Electrical Works",
    profile: "Worker profile",
    type: "photo",
    title: "New apartment wiring completed",
    location: "Kakkanad",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
    badge: "Latest work"
  },
  {
    author: "Green Leaf Restaurant",
    profile: "Business profile",
    type: "video",
    title: "Today special kitchen update",
    location: "Kochi",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    badge: "Video post"
  },
  {
    author: "TrustLoop Seller",
    profile: "Seller profile",
    type: "photo",
    title: "Honda Activa fresh photos uploaded",
    location: "Ernakulam",
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=900&q=80",
    badge: "Product update"
  }
];

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [marketListings, setMarketListings] = useState(demoListings);
  const [dataStatus, setDataStatus] = useState("Demo listings loaded");

  useEffect(() => watchAuthState(setFirebaseUser), []);

  useEffect(() => {
    let active = true;

    fetchListings()
      .then(({ listings }) => {
        if (!active) return;
        if (listings?.length) {
          setMarketListings(listings.map(mapListingFromApi));
          setDataStatus("Live listings from backend");
        } else {
          setDataStatus("Backend connected, waiting for approved listings");
        }
      })
      .catch(() => {
        if (active) setDataStatus("Demo mode until backend is running");
      });

    return () => {
      active = false;
    };
  }, []);

  function handleLocalListingCreated(listing) {
    setMarketListings((current) => [listing, ...current]);
    setDataStatus("Listing prepared for admin approval");
  }

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/82 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg border border-mint/40 bg-mint/12">
              <ShieldCheck className="size-5 text-mint" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-normal">TrustLoop</span>
              <span className="block text-xs text-slate-400">Verified marketplace</span>
            </span>
          </a>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#market">Marketplace</a>
            <a href="#sell">Sell</a>
            <a href="#admin">Admin</a>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-button" aria-label="Notifications">
              <Bell className="size-5" />
            </button>
            {firebaseUser ? (
              <button className="secondary-button" onClick={logoutFirebaseUser}>
                <BadgeCheck className="size-4 text-mint" />
                Verified
              </button>
            ) : (
              <button className="primary-button" onClick={() => setAuthOpen(true)}>
                <Phone className="size-4" />
                OTP Login
              </button>
            )}
          </div>
        </nav>
      </header>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      <main id="top">
        <Hero listings={marketListings} />
        <Marketplace listings={marketListings} dataStatus={dataStatus} />
        <SellFlow firebaseUser={firebaseUser} onListingCreated={handleLocalListingCreated} />
        <AdminDashboard firebaseUser={firebaseUser} />
      </main>
    </div>
  );
}

function AuthModal({ onClose }) {
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => () => resetRecaptcha(), []);

  async function handleSendOtp(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const result = await sendPhoneOtp(phoneNumber.trim());
      setConfirmationResult(result);
      setStatus(result.devOtp ? `Development OTP: ${result.devOtp}` : "OTP sent. Check your phone.");
    } catch (error) {
      setStatus(getOtpErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    if (!confirmationResult) return;

    setLoading(true);
    setStatus("");

    try {
      await confirmPhoneOtp(confirmationResult, otp.trim());
      setStatus("Phone verified successfully.");
      setTimeout(onClose, 700);
    } catch (error) {
      setStatus(getOtpErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-backdrop" role="dialog" aria-modal="true" aria-label="Phone OTP login">
      <div className="auth-modal">
        <div className="auth-modal-header">
          <div>
            <p className="eyebrow">Secure login</p>
            <h2>Verify your phone</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close login">
            <X className="size-5" />
          </button>
        </div>

        {!isFirebaseReady && (
          <div className="auth-warning">
            OTP service is not configured. Check backend API settings.
          </div>
        )}

        <form onSubmit={confirmationResult ? handleVerifyOtp : handleSendOtp} className="auth-form">
          <label>
            Phone number
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+919876543210"
              inputMode="tel"
              disabled={Boolean(confirmationResult)}
            />
          </label>

          {confirmationResult && (
            <label>
              OTP code
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="6 digit OTP"
                inputMode="numeric"
              />
            </label>
          )}

          {status && <p className="auth-status">{status}</p>}

          <button className="primary-button large" disabled={loading || !isFirebaseReady}>
            {loading ? "Please wait..." : confirmationResult ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

function getOtpErrorMessage(error) {
  const code = error?.code || "";

  if (code.includes("configuration-not-found")) {
    return "OTP service is not ready. Check backend SMS provider settings.";
  }

  if (code.includes("invalid-phone-number")) {
    return "Phone number format is invalid. Use +91XXXXXXXXXX format.";
  }

  if (code.includes("too-many-requests")) {
    return "Too many OTP attempts. Wait a few minutes and try again.";
  }

  if (code.includes("invalid-verification-code")) {
    return "OTP code is incorrect. Please check the SMS and try again.";
  }

  return error?.message || "OTP request failed. Check phone number or SMS provider settings.";
}

function Hero({ listings }) {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-16">
      <div className="flex flex-col justify-center">
        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan">
          <ShieldCheck className="size-4" />
          MistriHub + TrustLoop demo
        </div>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-normal text-white sm:text-6xl lg:text-7xl">
          One trusted place for products, shops, businesses, and workers.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Buy or sell products, list a local business, create a worker profile, and post latest work photos or videos from one account.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#market" className="primary-button large">
            Explore trusted deals
            <ChevronRight className="size-5" />
          </a>
          <a href="#sell" className="secondary-button large">
            Sell product
          </a>
        </div>
      </div>
      <div className="hero-board" aria-label="Trusted marketplace preview">
        <div className="hero-search">
          <Search className="size-5 text-slate-400" />
          <span>Search product and city: iPhone in Kochi...</span>
          <SlidersHorizontal className="ml-auto size-5 text-cyan" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {listings.slice(0, 2).map((listing) => (
            <ListingCard key={listing.title} listing={listing} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

function Marketplace({ listings, dataStatus }) {
  const [productQuery, setProductQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const normalizedProduct = productQuery.trim().toLowerCase();
  const normalizedCity = cityQuery.trim().toLowerCase();
  const filteredListings = listings.filter((listing) => {
    const productText = `${listing.title} ${listing.category}`.toLowerCase();
    const productMatch = !normalizedProduct || productText.includes(normalizedProduct);
    const cityMatch = !normalizedCity || listing.location.toLowerCase().includes(normalizedCity);
    return productMatch && cityMatch;
  });

  return (
    <section id="market" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h2>Verified listings by product and city</h2>
          <p className="data-status">{dataStatus}</p>
        </div>
        <div className="filter-row" aria-label="Marketplace filters">
          <button>Price</button>
          <button>City</button>
          <button>Interested</button>
          <button>Verified</button>
          <button>Newest</button>
        </div>
      </div>
      <div className="search-panel" aria-label="Search by product and city">
        <label>
          Product
          <div><Search className="size-4" /><input value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="iPhone, Activa, i20, sofa" /></div>
        </label>
        <label>
          City / location
          <div><MapPin className="size-4" /><input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Kochi, Aluva, Ernakulam" /></div>
        </label>
        <span>{filteredListings.length} trusted matches</span>
      </div>
      <div className="category-grid">
        {categories.map(({ name, icon: Icon, count }) => (
          <button className="category-chip" key={name}>
            <Icon className="size-5" />
            <span>{name}</span>
            <small>{count}</small>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <ListingCard listing={listing} key={listing.title} />
        ))}
      </div>
    </section>
  );
}

function ListingCard({ listing, compact = false }) {
  return (
    <article className={`listing-card ${compact ? "compact" : ""}`}>
      <div className="listing-image">
        <img src={listing.image} alt={listing.title} />
        <span className="verified-pill">
          <BadgeCheck className="size-4" />
          Trust {listing.score}
        </span>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="category-label">{listing.category}</span>
          <span className="rating">
            <Star className="size-4 fill-amber text-amber" />
            {listing.rating}
          </span>
        </div>
        <h3>{listing.title}</h3>
        <div className="mt-3 flex items-center justify-between gap-3">
          <strong className="price">{listing.price}</strong>
          <span className="distance">
            <MapPin className="size-4" />
            {listing.location}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {listing.tags.map((tag) => (
            <span className="mini-tag" key={tag}>{tag}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="countdown">
            <Bell className="size-4" />
            {listing.interest || "Interested buyers"}
          </span>
          <button className="ghost-button">Send offer</button>
        </div>
      </div>
    </article>
  );
}


function PlatformDemo() {
  return (
    <>
      <section className="platform-overview" aria-label="Combined platform demo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">One platform demo</p>
            <h2>Marketplace, businesses, and workers in one app.</h2>
            <p className="data-status">Review demo only. MistriHub live website is not changed.</p>
          </div>
        </div>
        <div className="platform-grid">
          {platformModules.map(({ title, body, icon: Icon, stat }) => (
            <article className="platform-card" key={title}>
              <div className="platform-icon"><Icon className="size-6" /></div>
              <span>{stat}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="businesses" className="combined-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Local listings</p>
            <h2>Shops, hotels, restaurants, hospitals, plots, and businesses.</h2>
          </div>
          <button className="secondary-button"><Building2 className="size-4" /> Add business</button>
        </div>
        <div className="profile-grid">
          {businessListings.map(({ icon: BusinessIcon, ...item }) => (
            <article className="profile-card" key={item.name}>
              <img src={item.image} alt={item.name} />
              <div className="profile-body">
                <div className="profile-title-row">
                  <div className="platform-icon small"><BusinessIcon className="size-4" /></div>
                  <span>{item.type}</span>
                </div>
                <h3>{item.name}</h3>
                <p><MapPin className="size-4" /> {item.location} • {item.rating}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => <span className="mini-tag" key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="workers" className="combined-section alt-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Worker profiles</p>
            <h2>Workers can show skills, ratings, city, and latest work.</h2>
          </div>
          <button className="secondary-button"><Wrench className="size-4" /> Add worker</button>
        </div>
        <div className="profile-grid">
          {workerProfiles.map((worker) => (
            <article className="worker-profile-card" key={worker.name}>
              <img src={worker.image} alt={worker.name} />
              <div>
                <span className="category-label">{worker.role}</span>
                <h3>{worker.name}</h3>
                <p><MapPin className="size-4" /> {worker.city} • {worker.jobs}</p>
                <strong><Star className="size-4 fill-amber text-amber" /> {worker.rating}</strong>
                <div className="mt-4 flex flex-wrap gap-2">
                  {worker.skills.map((skill) => <span className="mini-tag" key={skill}>{skill}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="feed" className="combined-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest feed</p>
            <h2>Photo and video updates from shops, workers, sellers, and businesses.</h2>
          </div>
          <button className="primary-button"><Camera className="size-4" /> Upload post</button>
        </div>
        <div className="feed-grid">
          {latestFeed.map((post) => (
            <article className="feed-card" key={post.title}>
              <div className="feed-media">
                <img src={post.image} alt={post.title} />
                <span>{post.type === "video" ? <PlayCircle className="size-4" /> : <Camera className="size-4" />} {post.badge}</span>
              </div>
              <div className="feed-body">
                <p>{post.profile}</p>
                <h3>{post.title}</h3>
                <div className="feed-meta">
                  <span><HeartHandshake className="size-4" /> {post.author}</span>
                  <span><MapPin className="size-4" /> {post.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function SellFlow({ firebaseUser, onListingCreated }) {
  const [form, setForm] = useState({
    title: "Samsung S23 Ultra with invoice",
    category: "Mobiles",
    price: "52000",
    expiresAt: "2026-06-18",
    description: "Original bill, box, charger, no repair history. Available for local inspection.",
    location: "Kakkanad, Kochi",
    contactMode: "whatsapp_only",
    verificationProof: "IMEI clean, original bill available, battery health 91%, no repair history."
  });
  const [status, setStatus] = useState("Listings go to AI scan and admin approval before public view.");
  const [submitting, setSubmitting] = useState(false);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Preparing listing for moderation...");

    const localListing = {
      title: form.title,
      category: form.category,
      price: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(form.price || 0)),
      location: form.location,
      interest: "Interest alert ready",
      score: 72,
      rating: 4.5,
      expires: "Admin review",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      tags: ["AI review queued", `${form.category} proof required`, "Admin approval"]
    };

    try {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await createListing({
          title: form.title,
          description: form.description,
          photos: [{ url: localListing.image }],
          price: Number(form.price),
          category: form.category,
          location: { label: form.location, longitude: 76.3499, latitude: 10.0159 },
          expiresAt: new Date(form.expiresAt).toISOString(),
          contactMode: form.contactMode,
          verificationDetails: {
            category: form.category,
            proofSummary: form.verificationProof,
            checklist: categoryVerificationFields[form.category] || []
          }
        }, token);
        setStatus("Submitted to backend. Admin approval is required before public listing.");
      } else {
        setStatus("Login with OTP to submit to backend. Showing a local pending preview for now.");
      }

      onListingCreated(localListing);
    } catch (error) {
      setStatus(error.message || "Submission failed. Check backend and Firebase settings.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="sell" className="bg-white/[0.025] py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
        <div>
          <p className="eyebrow">Seller flow</p>
          <h2 className="section-title">Sell safely after approval.</h2>
          <p className="section-copy">
            Add product details, price, location, photos, contact choice, and proof. Admin approves it before buyers see it.
          </p>
          <div className="timeline">
            {["OTP login", "Add details", "Admin approval", "Go public"].map((step, index) => (
              <div className="timeline-step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
        <form className="listing-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <Upload className="size-5 text-mint" />
            <span>New product listing</span>
          </div>
          <div className="form-grid">
            <label>
              Title
              <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} />
            </label>
            <label>
              Category
              <select value={form.category} onChange={(event) => updateForm("category", event.target.value)}>
                {categories.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </label>
            <label>
              Price
              <input value={form.price} onChange={(event) => updateForm("price", event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Expire date
              <input value={form.expiresAt} onChange={(event) => updateForm("expiresAt", event.target.value)} type="date" />
            </label>
            <label className="wide">
              Description
              <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
            </label>
            <label>
              Location
              <input value={form.location} onChange={(event) => updateForm("location", event.target.value)} />
            </label>
            <label>
              Contact
              <select value={form.contactMode} onChange={(event) => updateForm("contactMode", event.target.value)}>
                <option value="show_phone">Show phone number</option>
                <option value="hide_phone">Hide phone number</option>
                <option value="whatsapp_only">WhatsApp chat only</option>
              </select>
            </label>
            <label className="wide">
              Verification proof
              <textarea value={form.verificationProof} onChange={(event) => updateForm("verificationProof", event.target.value)} />
            </label>
          </div>
          <div className="verification-panel">
            <strong>{form.category} checklist</strong>
            <div>
              {(categoryVerificationFields[form.category] || []).map((item) => (
                <span key={item}><Check className="size-4" />{item}</span>
              ))}
            </div>
          </div>
          <div className="photo-row">
            <span>Photo 1</span>
            <span>Photo 2</span>
            <span>Invoice</span>
          </div>
          <p className="form-status">{status}</p>
          <button className="primary-button large submit-listing" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit for approval"}
          </button>
        </form>
      </div>
    </section>
  );
}

function AdminDashboard({ firebaseUser }) {
  const [pendingListings, setPendingListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [adminStatus, setAdminStatus] = useState("Login and claim admin access to review submitted listings.");
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

  async function getToken() {
    if (!firebaseUser) throw new Error("Login required");
    return firebaseUser.getIdToken();
  }

  async function loadAdminData() {
    setLoading(true);
    try {
      const token = await getToken();
      const [dashboard, pending] = await Promise.all([
        fetchAdminDashboard(token),
        fetchPendingListings(token)
      ]);
      setStats(dashboard);
      setPendingListings(pending.listings || []);
      setAdminStatus((pending.listings?.length || 0) ? "Pending listings ready for review." : "No pending listings right now.");
    } catch (error) {
      setAdminStatus(error.message || "Admin data unavailable. Claim admin access first.");
    } finally {
      setLoading(false);
    }
  }

  async function claimAdmin() {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${apiBase}/auth/claim-admin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Admin claim failed");
      setAdminStatus("Admin access enabled. Loading review queue...");
      await loadAdminData();
    } catch (error) {
      setAdminStatus(error.message || "Admin claim failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDecision(listingId, decision) {
    setLoading(true);
    try {
      const token = await getToken();
      await decideListing(listingId, decision, token, decision === "approve" ? "Verified by admin" : "Rejected during manual review");
      setPendingListings((current) => current.filter((listing) => listing._id !== listingId));
      setAdminStatus(decision === "approve" ? "Listing approved and public." : "Listing rejected.");
    } catch (error) {
      setAdminStatus(error.message || "Decision failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="admin" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h2>Approve real listings before they reach buyers.</h2>
          <p className="data-status">{adminStatus}</p>
        </div>
        <div className="admin-actions">
          <button className="secondary-button" onClick={claimAdmin} disabled={loading || !firebaseUser}>Claim admin</button>
          <button className="primary-button" onClick={loadAdminData} disabled={loading || !firebaseUser}>Refresh queue</button>
        </div>
      </div>
      <div className="admin-grid">
        <article className="admin-panel large-panel">
          <div className="panel-title">
            <AlertTriangle className="size-5 text-amber" />
            Pending approval queue
          </div>
          {pendingListings.length === 0 && (
            <div className="empty-state">No pending listings right now.</div>
          )}
          {pendingListings.map((row) => {
            const risk = row.moderation?.riskScore >= 70 ? "High" : row.moderation?.riskScore >= 30 ? "Medium" : "Low";
            return (
              <div className="queue-row" key={row._id}>
                <div>
                  <strong>{row.title}</strong>
                  <span>{`${row.category} • ${row.location?.label || "No city"} • ${row.verificationDetails?.proofSummary || "Proof pending"}`}</span>
                </div>
                <span className={`risk ${risk.toLowerCase()}`}>{risk}</span>
                <div className="decision-actions">
                  <button className="approve-button" onClick={() => handleDecision(row._id, "approve")} disabled={loading}>Approve</button>
                  <button className="review-button" onClick={() => handleDecision(row._id, "reject")} disabled={loading}>Reject</button>
                </div>
              </div>
            );
          })}
        </article>
        <article className="admin-panel">
          <div className="panel-title">
            <ChartNoAxesCombined className="size-5 text-cyan" />
            Analytics
          </div>
          <div className="analytics-grid">
            <div><strong>{stats?.pendingListings ?? "--"}</strong><span>pending reviews</span></div>
            <div><strong>{stats?.highRisk ?? "--"}</strong><span>high risk alerts</span></div>
            <div><strong>{stats?.users ?? "--"}</strong><span>active users</span></div>
            <div><strong>{stats?.openReports ?? "--"}</strong><span>open reports</span></div>
          </div>
        </article>
      </div>
    </section>
  );
}
export default App;





