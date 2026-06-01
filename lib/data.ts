import {
  Award,
  BadgeCheck,
  Bike,
  Bolt,
  BriefcaseBusiness,
  Building2,
  Car,
  Clock,
  Camera,
  Drill,
  Hammer,
  Home,
  Hotel,
  LucideIcon,
  Pill,
  Paintbrush,
  Phone,
  Salad,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  ShoppingBasket,
  Sofa,
  Smartphone,
  Star,
  Stethoscope,
  Store,
  GraduationCap,
  Snowflake,
  Users,
  Wrench
} from "lucide-react";

export type Availability = "Available Now" | "Busy Today" | "Offline";
export type WorkerLevel = "Bronze" | "Silver" | "Gold" | "Elite";

export type Worker = {
  id: string;
  name: string;
  skill: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  experience: string;
  priceRange: string;
  phone: string;
  whatsapp: string;
  trustScore: number;
  jobsCompleted: number;
  responseTime: string;
  availability: Availability;
  level: WorkerLevel;
  about: string;
  latitude?: number;
  longitude?: number;
  gpsOnline?: boolean;
};

export type Product = {
  id: string;
  title: string;
  category: string;
  price: string;
  location: string;
  posted: string;
  seller: string;
  sellerWhatsapp?: string;
  sellerPhone?: string;
  sellerTrust: number;
  condition: string;
  imageTone: string;
  imageUrl?: string;
  description: string;
};

export type Business = {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  opens: string;
  closes: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviews: number;
  verified: boolean;
  offer: string;
  trustScore: number;
  photos: string[];
  imageTone: string;
  trending: boolean;
  openNow: boolean;
};

export type RadarWorker = {
  id: string;
  name: string;
  skill: string;
  rating: number;
  verified: boolean;
  phone: string;
  whatsapp: string;
  lat: number;
  lng: number;
  distanceKm: number;
  etaMinutes: number;
  online: boolean;
};

export const categories: { name: string; icon: LucideIcon; tone: string }[] = [
  { name: "Plumber", icon: Wrench, tone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200" },
  { name: "Electrician", icon: Bolt, tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200" },
  { name: "Mechanic", icon: Drill, tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200" },
  { name: "Driver", icon: Car, tone: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200" },
  { name: "Painter", icon: Paintbrush, tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200" },
  { name: "Labour", icon: Hammer, tone: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-200" },
  { name: "CCTV Installer", icon: Camera, tone: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-200" },
  { name: "Carpenter", icon: Hammer, tone: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200" },
  { name: "A/C Fridge Repair", icon: Snowflake, tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200" },
  { name: "Mobile", icon: Smartphone, tone: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200" },
  { name: "Bike", icon: Bike, tone: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200" },
  { name: "Car", icon: Car, tone: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200" },
  { name: "Furniture", icon: Sofa, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" },
  { name: "Property", icon: Building2, tone: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-200" }
];

export const businessCategories: { name: string; icon: LucideIcon; tone: string }[] = [
  { name: "Hotels", icon: Hotel, tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200" },
  { name: "Restaurants", icon: Salad, tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200" },
  { name: "Shops", icon: Store, tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200" },
  { name: "Grocery stores", icon: ShoppingBasket, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" },
  { name: "Medical stores", icon: Pill, tone: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200" },
  { name: "Clinics", icon: Stethoscope, tone: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200" },
  { name: "Salons", icon: Scissors, tone: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200" },
  { name: "Coaching centers", icon: GraduationCap, tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200" },
  { name: "Garages", icon: Car, tone: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200" },
  { name: "Mobile repair shops", icon: Smartphone, tone: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200" },
  { name: "Hardware shops", icon: Hammer, tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200" },
  { name: "Electronics shops", icon: ShoppingBag, tone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200" }
];

export const workers: Worker[] = [
  { id: "rajesh-electrician", name: "Rajesh Kumar", skill: "Electrician", location: "Lajpat Nagar, Delhi", distance: "1.8 km", rating: 4.9, reviews: 184, experience: "9 yrs", priceRange: "Rs 250-600", phone: "+91 98765 10101", whatsapp: "919876510101", trustScore: 96, jobsCompleted: 628, responseTime: "4 min", availability: "Available Now", level: "Elite", about: "Switch boards, inverter wiring, MCB repair, and emergency night calls with clean finishing." },
  { id: "imran-plumber", name: "Imran Ansari", skill: "Plumber", location: "Indiranagar, Bengaluru", distance: "2.2 km", rating: 4.8, reviews: 151, experience: "7 yrs", priceRange: "Rs 199-700", phone: "+91 98765 10102", whatsapp: "919876510102", trustScore: 93, jobsCompleted: 511, responseTime: "6 min", availability: "Available Now", level: "Gold", about: "Leak repair, tap fitting, motor setup, bathroom line checks, and same-day service." },
  { id: "sunita-painter", name: "Sunita Sharma", skill: "Painter", location: "Kothrud, Pune", distance: "3.0 km", rating: 4.9, reviews: 203, experience: "11 yrs", priceRange: "Rs 8-22/sq ft", phone: "+91 98765 10103", whatsapp: "919876510103", trustScore: 98, jobsCompleted: 742, responseTime: "8 min", availability: "Busy Today", level: "Elite", about: "Texture walls, waterproof coating, rental repainting, and color consultation." },
  { id: "ravi-mechanic", name: "Ravi Verma", skill: "Bike Mechanic", location: "Gomti Nagar, Lucknow", distance: "1.1 km", rating: 4.7, reviews: 119, experience: "6 yrs", priceRange: "Rs 150-1200", phone: "+91 98765 10104", whatsapp: "919876510104", trustScore: 89, jobsCompleted: 386, responseTime: "5 min", availability: "Available Now", level: "Gold", about: "Doorstep bike repair, battery jump, puncture, oil change, and pickup support." },
  { id: "balram-labour", name: "Balram Yadav", skill: "Labour Contractor", location: "Patna City, Patna", distance: "4.6 km", rating: 4.6, reviews: 88, experience: "12 yrs", priceRange: "Rs 600-900/day", phone: "+91 98765 10105", whatsapp: "919876510105", trustScore: 86, jobsCompleted: 332, responseTime: "12 min", availability: "Available Now", level: "Silver", about: "Daily wage labour team for shifting, construction, loading, and urgent site work." },
  { id: "arif-ac", name: "Arif Khan", skill: "AC Technician", location: "Andheri West, Mumbai", distance: "2.9 km", rating: 4.8, reviews: 176, experience: "8 yrs", priceRange: "Rs 399-1800", phone: "+91 98765 10106", whatsapp: "919876510106", trustScore: 94, jobsCompleted: 557, responseTime: "7 min", availability: "Available Now", level: "Gold", about: "AC service, gas refill, deep cleaning, installation, and annual maintenance." },
  { id: "meena-tailor", name: "Meena Devi", skill: "Tailor", location: "Vaishali, Jaipur", distance: "2.7 km", rating: 4.7, reviews: 97, experience: "10 yrs", priceRange: "Rs 120-950", phone: "+91 98765 10107", whatsapp: "919876510107", trustScore: 91, jobsCompleted: 408, responseTime: "14 min", availability: "Busy Today", level: "Gold", about: "Blouse fitting, alterations, school uniforms, and urgent festival orders." },
  { id: "manoj-carpenter", name: "Manoj Tiwari", skill: "Carpenter", location: "Salt Lake, Kolkata", distance: "3.4 km", rating: 4.8, reviews: 132, experience: "13 yrs", priceRange: "Rs 350-2500", phone: "+91 98765 10108", whatsapp: "919876510108", trustScore: 92, jobsCompleted: 489, responseTime: "10 min", availability: "Available Now", level: "Gold", about: "Modular repair, shelves, doors, polish, and small furniture builds." },
  { id: "pooja-cleaning", name: "Pooja Rani", skill: "Home Cleaning", location: "Sector 62, Noida", distance: "1.5 km", rating: 4.9, reviews: 211, experience: "5 yrs", priceRange: "Rs 499-2500", phone: "+91 98765 10109", whatsapp: "919876510109", trustScore: 95, jobsCompleted: 602, responseTime: "9 min", availability: "Available Now", level: "Elite", about: "Bathroom, kitchen, sofa, and full home cleaning with verified helpers." },
  { id: "ganesh-driver", name: "Ganesh Pawar", skill: "Driver", location: "Hadapsar, Pune", distance: "5.2 km", rating: 4.6, reviews: 74, experience: "14 yrs", priceRange: "Rs 800-2200/day", phone: "+91 98765 10110", whatsapp: "919876510110", trustScore: 84, jobsCompleted: 280, responseTime: "18 min", availability: "Offline", level: "Silver", about: "City, outstation, wedding duty, and monthly driver service." },
  { id: "naseem-mobile", name: "Naseem Ali", skill: "Mobile Repair", location: "Charminar, Hyderabad", distance: "0.9 km", rating: 4.8, reviews: 165, experience: "7 yrs", priceRange: "Rs 199-4500", phone: "+91 98765 10111", whatsapp: "919876510111", trustScore: 90, jobsCompleted: 456, responseTime: "6 min", availability: "Available Now", level: "Gold", about: "Screen, battery, charging port, software, and data transfer help." },
  { id: "kavita-cook", name: "Kavita Solanki", skill: "Cook", location: "Satellite, Ahmedabad", distance: "2.4 km", rating: 4.7, reviews: 102, experience: "9 yrs", priceRange: "Rs 2500-8500/mo", phone: "+91 98765 10112", whatsapp: "919876510112", trustScore: 88, jobsCompleted: 319, responseTime: "16 min", availability: "Busy Today", level: "Silver", about: "Gujarati, Punjabi, Jain, tiffin prep, and party cooking." },
  { id: "prakash-camera", name: "Prakash Sahu", skill: "CCTV Installer", location: "Raipur Junction, Raipur", distance: "3.8 km", rating: 4.6, reviews: 69, experience: "6 yrs", priceRange: "Rs 499-9000", phone: "+91 98765 10113", whatsapp: "919876510113", trustScore: 85, jobsCompleted: 244, responseTime: "20 min", availability: "Available Now", level: "Silver", about: "CCTV setup, DVR repair, Wi-Fi cameras, and shop security packages." },
  { id: "jaspreet-welder", name: "Jaspreet Singh", skill: "Welder", location: "Model Town, Ludhiana", distance: "4.1 km", rating: 4.5, reviews: 57, experience: "16 yrs", priceRange: "Rs 500-6000", phone: "+91 98765 10114", whatsapp: "919876510114", trustScore: 82, jobsCompleted: 231, responseTime: "22 min", availability: "Available Now", level: "Bronze", about: "Gate, grill, shutter, railing, and on-site welding jobs." },
  { id: "shahid-fridge", name: "Shahid Qureshi", skill: "Fridge Repair", location: "Bhopal New Market", distance: "2.1 km", rating: 4.7, reviews: 91, experience: "8 yrs", priceRange: "Rs 299-2500", phone: "+91 98765 10115", whatsapp: "919876510115", trustScore: 87, jobsCompleted: 297, responseTime: "11 min", availability: "Available Now", level: "Silver", about: "Cooling issue, compressor check, gas refill, and same-day diagnosis." },
  { id: "deepa-beauty", name: "Deepa Nair", skill: "Beauty Service", location: "Kakkanad, Kochi", distance: "1.7 km", rating: 4.9, reviews: 143, experience: "6 yrs", priceRange: "Rs 299-3500", phone: "+91 98765 10116", whatsapp: "919876510116", trustScore: 92, jobsCompleted: 371, responseTime: "8 min", availability: "Busy Today", level: "Gold", about: "At-home grooming, bridal trial, facial, waxing, and party makeup." },
  { id: "vivek-pest", name: "Vivek Maurya", skill: "Pest Control", location: "Rohini, Delhi", distance: "3.2 km", rating: 4.6, reviews: 82, experience: "5 yrs", priceRange: "Rs 799-4500", phone: "+91 98765 10117", whatsapp: "919876510117", trustScore: 83, jobsCompleted: 220, responseTime: "15 min", availability: "Available Now", level: "Bronze", about: "Cockroach, termite, bed bug, and home sanitization service." },
  { id: "omkar-tutor", name: "Omkar Kulkarni", skill: "Home Tutor", location: "Nashik Road, Nashik", distance: "2.5 km", rating: 4.8, reviews: 110, experience: "4 yrs", priceRange: "Rs 350-900/hr", phone: "+91 98765 10118", whatsapp: "919876510118", trustScore: 90, jobsCompleted: 188, responseTime: "13 min", availability: "Offline", level: "Gold", about: "Maths and science for classes 6-10 with weekly progress reports." },
  { id: "suresh-shifting", name: "Suresh Patel", skill: "Packers & Movers", location: "Vesu, Surat", distance: "5.8 km", rating: 4.5, reviews: 64, experience: "10 yrs", priceRange: "Rs 1200-18000", phone: "+91 98765 10119", whatsapp: "919876510119", trustScore: 81, jobsCompleted: 251, responseTime: "19 min", availability: "Available Now", level: "Bronze", about: "Local shifting, loading team, mini truck, and careful packing." },
  { id: "farida-nurse", name: "Farida Sheikh", skill: "Elder Care", location: "Civil Lines, Nagpur", distance: "2.0 km", rating: 4.9, reviews: 125, experience: "9 yrs", priceRange: "Rs 700-1800/day", phone: "+91 98765 10120", whatsapp: "919876510120", trustScore: 97, jobsCompleted: 414, responseTime: "5 min", availability: "Available Now", level: "Elite", about: "Elder support, medicine reminders, patient care, and verified home assistance." }
];

export const products: Product[] = [
  { id: "hero-splendor-2021", title: "Hero Splendor Plus 2021", category: "Bike", price: "Rs 48,000", location: "Rohini, Delhi", posted: "3 mins ago", seller: "Vikram", sellerTrust: 91, condition: "Good", imageTone: "from-orange-300 to-red-500", description: "Single owner, all papers clear, recently serviced, average 60+ kmpl." },
  { id: "iphone-13", title: "iPhone 13 128GB", category: "Mobile", price: "Rs 34,500", location: "Borivali, Mumbai", posted: "12 mins ago", seller: "Aarti", sellerTrust: 88, condition: "Excellent", imageTone: "from-slate-200 to-slate-500", description: "Battery 88%, no repair history, box and cable included." },
  { id: "wooden-sofa", title: "5 Seater Wooden Sofa", category: "Furniture", price: "Rs 12,999", location: "Indiranagar, Bengaluru", posted: "25 mins ago", seller: "Ramesh", sellerTrust: 82, condition: "Used", imageTone: "from-amber-200 to-yellow-700", description: "Solid wood sofa with cushions, pickup available this week." },
  { id: "alto-k10", title: "Maruti Alto K10 VXI", category: "Car", price: "Rs 2,35,000", location: "Gomti Nagar, Lucknow", posted: "1 hr ago", seller: "Nitin", sellerTrust: 90, condition: "Good", imageTone: "from-sky-200 to-blue-600", description: "Petrol, manual, second owner, insurance active, smooth engine." },
  { id: "shop-rent", title: "120 sq ft Shop for Rent", category: "Property", price: "Rs 15,000/mo", location: "Kothrud, Pune", posted: "2 hrs ago", seller: "Sheetal", sellerTrust: 86, condition: "Ready", imageTone: "from-emerald-200 to-teal-700", description: "Main road facing shop suitable for salon, service center, or office." },
  { id: "washing-machine", title: "LG Washing Machine 7kg", category: "Appliance", price: "Rs 8,500", location: "Sector 62, Noida", posted: "2 hrs ago", seller: "Kunal", sellerTrust: 77, condition: "Good", imageTone: "from-blue-100 to-cyan-600", description: "Front load, working well, minor scratches on body." },
  { id: "royal-enfield", title: "Royal Enfield Classic 350", category: "Bike", price: "Rs 1,38,000", location: "Jaipur", posted: "4 hrs ago", seller: "Dev", sellerTrust: 92, condition: "Excellent", imageTone: "from-zinc-300 to-neutral-800", description: "Low running, alloy wheels, new tyre, clean transfer." },
  { id: "study-table", title: "Study Table with Chair", category: "Furniture", price: "Rs 3,200", location: "Ahmedabad", posted: "Today", seller: "Nisha", sellerTrust: 84, condition: "Used", imageTone: "from-lime-200 to-emerald-600", description: "Compact table, drawer storage, suitable for students and work from home." },
  { id: "oneplus-tv", title: "OnePlus 43 inch Smart TV", category: "Electronics", price: "Rs 17,999", location: "Hyderabad", posted: "Today", seller: "Rehan", sellerTrust: 89, condition: "Excellent", imageTone: "from-violet-200 to-indigo-700", description: "4K smart TV, remote included, wall mount available." },
  { id: "office-chair", title: "Ergonomic Office Chair", category: "Furniture", price: "Rs 4,800", location: "Kolkata", posted: "Today", seller: "Partho", sellerTrust: 80, condition: "Good", imageTone: "from-stone-200 to-zinc-700", description: "Mesh back, adjustable height, clean and comfortable." },
  { id: "cycle", title: "Firefox Hybrid Cycle", category: "Sports", price: "Rs 9,500", location: "Pune", posted: "Yesterday", seller: "Rahul", sellerTrust: 75, condition: "Good", imageTone: "from-green-200 to-lime-700", description: "21 gear cycle, recently tuned, helmet free." },
  { id: "water-purifier", title: "Kent RO Water Purifier", category: "Appliance", price: "Rs 5,500", location: "Patna", posted: "Yesterday", seller: "Ritu", sellerTrust: 81, condition: "Used", imageTone: "from-cyan-100 to-blue-500", description: "RO plus UV, serviced last month, filter condition good." },
  { id: "scooty", title: "Honda Activa 5G", category: "Bike", price: "Rs 52,000", location: "Surat", posted: "Yesterday", seller: "Hiral", sellerTrust: 88, condition: "Good", imageTone: "from-pink-200 to-rose-600", description: "Family used, good mileage, all documents available." },
  { id: "laptop", title: "Dell i5 Laptop 16GB RAM", category: "Electronics", price: "Rs 28,000", location: "Nagpur", posted: "2 days ago", seller: "Akash", sellerTrust: 83, condition: "Good", imageTone: "from-gray-200 to-slate-700", description: "SSD, Windows 11, ideal for office and coding." },
  { id: "bed", title: "Queen Bed with Storage", category: "Furniture", price: "Rs 10,000", location: "Bhopal", posted: "2 days ago", seller: "Madhav", sellerTrust: 79, condition: "Used", imageTone: "from-yellow-100 to-amber-700", description: "Hydraulic storage bed, dismantling support available." },
  { id: "camera", title: "Canon DSLR 200D", category: "Electronics", price: "Rs 31,000", location: "Kochi", posted: "2 days ago", seller: "Joel", sellerTrust: 87, condition: "Excellent", imageTone: "from-red-200 to-zinc-800", description: "Kit lens, memory card, bag, and two batteries." },
  { id: "fridge", title: "Whirlpool Double Door Fridge", category: "Appliance", price: "Rs 13,500", location: "Raipur", posted: "3 days ago", seller: "Naveen", sellerTrust: 78, condition: "Good", imageTone: "from-teal-100 to-cyan-700", description: "260L double door fridge, cooling perfect." },
  { id: "plot", title: "Residential Plot 900 sq ft", category: "Property", price: "Rs 18 lakh", location: "Nashik", posted: "3 days ago", seller: "Broker Verified", sellerTrust: 93, condition: "Verified", imageTone: "from-emerald-100 to-green-800", description: "Clear title, colony road touch, loan papers ready." },
  { id: "generator", title: "Honda Portable Generator", category: "Tools", price: "Rs 22,000", location: "Ludhiana", posted: "4 days ago", seller: "Harmeet", sellerTrust: 85, condition: "Good", imageTone: "from-orange-100 to-stone-700", description: "Low noise, home and shop backup, checked by mechanic." },
  { id: "tiles-leftover", title: "Premium Wall Tiles 120 pcs", category: "Material", price: "Rs 6,000", location: "Noida", posted: "4 days ago", seller: "BuildMart", sellerTrust: 94, condition: "New", imageTone: "from-fuchsia-100 to-purple-600", description: "Leftover sealed boxes from project, ideal for bathroom or kitchen." }
];

export const businesses: Business[] = [
  { id: "hotel-city-pride", name: "Hotel City Pride", category: "Hotels", location: "Karol Bagh, Delhi", distance: "1.1 km", opens: "24 hours", closes: "Open all day", phone: "+91 98765 20101", whatsapp: "919876520101", rating: 4.6, reviews: 824, verified: true, offer: "15% off weekday rooms", trustScore: 93, photos: ["Lobby", "Room", "Dining"], imageTone: "from-sky-200 to-blue-700", trending: true, openNow: true },
  { id: "tandoori-tales", name: "Tandoori Tales", category: "Restaurants", location: "Indiranagar, Bengaluru", distance: "0.8 km", opens: "11:00 AM", closes: "11:30 PM", phone: "+91 98765 20102", whatsapp: "919876520102", rating: 4.8, reviews: 1290, verified: true, offer: "Buy 1 thali, get lassi free", trustScore: 96, photos: ["Thali", "Seating", "Kitchen"], imageTone: "from-orange-200 to-red-700", trending: true, openNow: true },
  { id: "apna-kirana", name: "Apna Kirana Mart", category: "Grocery stores", location: "Sector 62, Noida", distance: "450 m", opens: "7:00 AM", closes: "10:30 PM", phone: "+91 98765 20103", whatsapp: "919876520103", rating: 4.5, reviews: 412, verified: true, offer: "Free delivery above Rs 499", trustScore: 89, photos: ["Storefront", "Grains", "Dairy"], imageTone: "from-emerald-200 to-lime-700", trending: false, openNow: true },
  { id: "medicare-plus", name: "MediCare Plus Pharmacy", category: "Medical stores", location: "Andheri West, Mumbai", distance: "650 m", opens: "8:00 AM", closes: "12:00 AM", phone: "+91 98765 20104", whatsapp: "919876520104", rating: 4.7, reviews: 538, verified: true, offer: "10% off wellness products", trustScore: 94, photos: ["Counter", "Medicines", "Care desk"], imageTone: "from-teal-100 to-cyan-700", trending: true, openNow: true },
  { id: "family-care-clinic", name: "Family Care Clinic", category: "Clinics", location: "Kothrud, Pune", distance: "1.4 km", opens: "9:00 AM", closes: "9:00 PM", phone: "+91 98765 20105", whatsapp: "919876520105", rating: 4.8, reviews: 676, verified: true, offer: "Rs 199 first consultation", trustScore: 97, photos: ["Reception", "Doctor room", "Lab"], imageTone: "from-red-100 to-rose-600", trending: true, openNow: true },
  { id: "glow-up-salon", name: "Glow Up Salon", category: "Salons", location: "Gomti Nagar, Lucknow", distance: "1.9 km", opens: "10:00 AM", closes: "9:30 PM", phone: "+91 98765 20106", whatsapp: "919876520106", rating: 4.6, reviews: 298, verified: true, offer: "Hair spa at Rs 699", trustScore: 88, photos: ["Styling chair", "Makeup", "Products"], imageTone: "from-pink-200 to-fuchsia-700", trending: false, openNow: true },
  { id: "bright-minds-coaching", name: "Bright Minds Coaching", category: "Coaching centers", location: "Vaishali, Jaipur", distance: "2.2 km", opens: "6:00 AM", closes: "8:30 PM", phone: "+91 98765 20107", whatsapp: "919876520107", rating: 4.7, reviews: 431, verified: true, offer: "Free demo class this week", trustScore: 91, photos: ["Classroom", "Library", "Results board"], imageTone: "from-indigo-200 to-violet-700", trending: true, openNow: true },
  { id: "sharma-auto-garage", name: "Sharma Auto Garage", category: "Garages", location: "Hadapsar, Pune", distance: "2.8 km", opens: "8:30 AM", closes: "8:00 PM", phone: "+91 98765 20108", whatsapp: "919876520108", rating: 4.5, reviews: 369, verified: true, offer: "Free brake check", trustScore: 86, photos: ["Service bay", "Tools", "Wash area"], imageTone: "from-orange-200 to-stone-800", trending: false, openNow: true },
  { id: "quickfix-mobile", name: "QuickFix Mobile Care", category: "Mobile repair shops", location: "Charminar, Hyderabad", distance: "300 m", opens: "10:00 AM", closes: "10:00 PM", phone: "+91 98765 20109", whatsapp: "919876520109", rating: 4.9, reviews: 742, verified: true, offer: "Screen guard free with repair", trustScore: 95, photos: ["Repair desk", "Accessories", "Testing"], imageTone: "from-blue-200 to-slate-800", trending: true, openNow: true },
  { id: "bharat-hardware", name: "Bharat Hardware & Paints", category: "Hardware shops", location: "Salt Lake, Kolkata", distance: "1.6 km", opens: "9:00 AM", closes: "9:00 PM", phone: "+91 98765 20110", whatsapp: "919876520110", rating: 4.4, reviews: 214, verified: true, offer: "5% contractor discount", trustScore: 84, photos: ["Paint aisle", "Tools", "Plumbing"], imageTone: "from-amber-200 to-yellow-800", trending: false, openNow: true },
  { id: "digital-zone", name: "Digital Zone Electronics", category: "Electronics shops", location: "Satellite, Ahmedabad", distance: "2.5 km", opens: "10:30 AM", closes: "9:30 PM", phone: "+91 98765 20111", whatsapp: "919876520111", rating: 4.6, reviews: 387, verified: true, offer: "No-cost EMI on appliances", trustScore: 90, photos: ["TV wall", "Appliances", "Billing"], imageTone: "from-cyan-200 to-blue-800", trending: true, openNow: true },
  { id: "new-market-general", name: "New Market General Store", category: "Shops", location: "Bhopal New Market", distance: "900 m", opens: "9:00 AM", closes: "10:00 PM", phone: "+91 98765 20112", whatsapp: "919876520112", rating: 4.3, reviews: 188, verified: false, offer: "Festival combo packs", trustScore: 78, photos: ["Shop", "Counters", "Offers"], imageTone: "from-violet-200 to-purple-700", trending: false, openNow: true },
  { id: "royal-biryani-house", name: "Royal Biryani House", category: "Restaurants", location: "Civil Lines, Nagpur", distance: "1.3 km", opens: "12:00 PM", closes: "12:30 AM", phone: "+91 98765 20113", whatsapp: "919876520113", rating: 4.7, reviews: 982, verified: true, offer: "Family pack Rs 499", trustScore: 92, photos: ["Biryani", "Family table", "Takeaway"], imageTone: "from-yellow-200 to-orange-800", trending: true, openNow: true },
  { id: "comfort-stay-inn", name: "Comfort Stay Inn", category: "Hotels", location: "Vesu, Surat", distance: "3.1 km", opens: "24 hours", closes: "Open all day", phone: "+91 98765 20114", whatsapp: "919876520114", rating: 4.4, reviews: 356, verified: true, offer: "Rs 999 day-use rooms", trustScore: 87, photos: ["Room", "Reception", "Parking"], imageTone: "from-stone-200 to-zinc-800", trending: false, openNow: true },
  { id: "greenbasket-fresh", name: "GreenBasket Fresh", category: "Grocery stores", location: "Kakkanad, Kochi", distance: "700 m", opens: "6:30 AM", closes: "10:00 PM", phone: "+91 98765 20115", whatsapp: "919876520115", rating: 4.6, reviews: 291, verified: true, offer: "Fresh fruits 12% off", trustScore: 88, photos: ["Fruits", "Vegetables", "Billing"], imageTone: "from-lime-200 to-green-800", trending: true, openNow: true },
  { id: "city-dental-care", name: "City Dental Care", category: "Clinics", location: "Rohini, Delhi", distance: "2.4 km", opens: "10:00 AM", closes: "7:00 PM", phone: "+91 98765 20116", whatsapp: "919876520116", rating: 4.8, reviews: 244, verified: true, offer: "Free dental checkup Sunday", trustScore: 94, photos: ["Chair", "Sterile room", "Reception"], imageTone: "from-sky-100 to-teal-700", trending: false, openNow: false }
];

export const liveFeed = [
  "Electrician available 2km away",
  "Bike listed 3 mins ago",
  "Painter completed 25 jobs",
  "Plumber accepted urgent job in Noida",
  "Mobile repair expert got ID verified",
  "Furniture deal trending near you",
  "Labour team available today",
  "Buyer interested in iPhone listing",
  "Elite worker replied in 4 mins",
  "New property posted in your area"
];

export const reviews = [
  { name: "Ankita S.", rating: 5, text: "Rajesh fixed the wiring issue within one hour. Verified profile helped me trust the booking.", city: "Delhi" },
  { name: "Mohan P.", rating: 5, text: "Sold my bike in one day. The local buyer chat and seller score are very useful.", city: "Pune" },
  { name: "Fatima K.", rating: 4, text: "Good worker options nearby. Response time badges make shortlisting simple.", city: "Mumbai" },
  { name: "Rohit V.", rating: 5, text: "Posted urgent plumber work at night and got two calls quickly. Kaam ho gaya.", city: "Noida" },
  { name: "Priya N.", rating: 5, text: "The trust score explains why someone is recommended, not just random stars.", city: "Bengaluru" },
  { name: "Sahil A.", rating: 4, text: "Marketplace feels safer than random groups because verified sellers stand out.", city: "Lucknow" },
  { name: "Neha J.", rating: 5, text: "My profile boost brought three new calls this week. Helpful for small service owners.", city: "Jaipur" },
  { name: "Irfan M.", rating: 5, text: "Admin report option is clear. I reported spam and it disappeared fast.", city: "Hyderabad" },
  { name: "Kiran D.", rating: 4, text: "Clean UI, fast search, and nice Hindi-English copy. Feels made for local India.", city: "Surat" },
  { name: "Sneha R.", rating: 5, text: "Booked elder care support with verified documents. Very reassuring for family.", city: "Nagpur" }
];

export const leaderboard = workers
  .filter((worker) => worker.level === "Elite" || worker.level === "Gold")
  .slice(0, 5);

export const notifications = [
  "Someone viewed your profile",
  "New job near you: fan repair",
  "Buyer interested in your listing",
  "Your Trust Score increased by 4",
  "Referral bonus unlocked"
];

export const trustFactors = [
  { label: "Phone Verified", icon: Phone },
  { label: "ID Verified", icon: BadgeCheck },
  { label: "Jobs Completed", icon: BriefcaseBusiness },
  { label: "Reviews", icon: Star },
  { label: "Response Time", icon: Clock },
  { label: "Scam Reports Checked", icon: ShieldCheck }
];

export const stats = [
  { label: "Verified workers", value: "12K+", icon: Users },
  { label: "Monthly local deals", value: "48K+", icon: Home },
  { label: "Avg. response", value: "9 min", icon: Clock },
  { label: "Trust checks", value: "6-step", icon: Award }
];

export const radarWorkers: RadarWorker[] = [
  { id: "radar-rajesh", name: "Rajesh Kumar", skill: "Electrician", rating: 4.9, verified: true, phone: "+91 98765 10101", whatsapp: "919876510101", lat: 28.6139, lng: 77.2097, distanceKm: 1.2, etaMinutes: 8, online: true },
  { id: "radar-imran", name: "Imran Ansari", skill: "Plumber", rating: 4.8, verified: true, phone: "+91 98765 10102", whatsapp: "919876510102", lat: 28.6212, lng: 77.2151, distanceKm: 2.4, etaMinutes: 12, online: true },
  { id: "radar-ravi", name: "Ravi Verma", skill: "Mechanic", rating: 4.7, verified: true, phone: "+91 98765 10104", whatsapp: "919876510104", lat: 28.6025, lng: 77.1983, distanceKm: 3.7, etaMinutes: 16, online: true },
  { id: "radar-arif", name: "Arif Khan", skill: "AC Repair", rating: 4.8, verified: true, phone: "+91 98765 10106", whatsapp: "919876510106", lat: 28.6315, lng: 77.1912, distanceKm: 5.8, etaMinutes: 22, online: true },
  { id: "radar-manoj", name: "Manoj Tiwari", skill: "Carpenter", rating: 4.8, verified: true, phone: "+91 98765 10108", whatsapp: "919876510108", lat: 28.5847, lng: 77.2298, distanceKm: 7.6, etaMinutes: 28, online: true },
  { id: "radar-balram", name: "Balram Yadav", skill: "Labour", rating: 4.6, verified: false, phone: "+91 98765 10105", whatsapp: "919876510105", lat: 28.6479, lng: 77.2254, distanceKm: 9.4, etaMinutes: 34, online: true },
  { id: "radar-delivery", name: "Aman Rider", skill: "Delivery", rating: 4.7, verified: true, phone: "+91 98765 10121", whatsapp: "919876510121", lat: 28.6092, lng: 77.2381, distanceKm: 4.8, etaMinutes: 18, online: true },
  { id: "radar-offline", name: "Ganesh Pawar", skill: "Driver", rating: 4.6, verified: true, phone: "+91 98765 10110", whatsapp: "919876510110", lat: 28.5942, lng: 77.1804, distanceKm: 8.9, etaMinutes: 31, online: false }
];
