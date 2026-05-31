import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "MistriHub Market | Kaam Bhi. Market Bhi.",
    template: "%s | MistriHub Market"
  },
  description:
    "Find nearby verified workers, buy and sell local products, post urgent jobs, and build trust through ratings in your area.",
  keywords: [
    "MistriHub Market",
    "nearby workers",
    "India marketplace",
    "local services",
    "buy sell nearby",
    "hyperlocal jobs"
  ],
  openGraph: {
    title: "MistriHub Market",
    description: "Trusted people nearby for work, market, jobs, and local services.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="app-shell">
          <Navbar />
          <main>{children}</main>
          <Footer />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
