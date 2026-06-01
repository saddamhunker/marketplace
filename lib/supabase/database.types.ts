export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = "user" | "worker" | "admin";
export type ListingType = "product" | "job" | "business";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type BookingStatus = "requested" | "accepted" | "on_the_way" | "arrived" | "completed" | "cancelled";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: AppRole;
          full_name: string;
          phone: string | null;
          whatsapp: string | null;
          avatar_url: string | null;
          city: string | null;
          area: string | null;
          referral_code: string | null;
          referred_by: string | null;
          login_streak: number;
          referral_points: number;
          profile_boost_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; full_name: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      trust_scores: {
        Row: {
          id: string;
          profile_id: string;
          score: number;
          phone_verified: boolean;
          id_verified: boolean;
          jobs_completed: number;
          reviews_count: number;
          avg_response_minutes: number | null;
          scam_reports_count: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["trust_scores"]["Row"]> & { profile_id: string };
        Update: Partial<Database["public"]["Tables"]["trust_scores"]["Row"]>;
        Relationships: [];
      };
      worker_profiles: {
        Row: {
          id: string;
          profile_id: string;
          skill: string;
          experience_years: number;
          price_min: number | null;
          price_max: number | null;
          location: string;
          latitude: number | null;
          longitude: number | null;
          distance_label: string | null;
          bio: string | null;
          level: string;
          availability: string;
          verification_status: VerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["worker_profiles"]["Row"]> & { profile_id: string; skill: string; location: string };
        Update: Partial<Database["public"]["Tables"]["worker_profiles"]["Row"]>;
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          owner_id: string;
          type: ListingType;
          title: string;
          category: string;
          description: string | null;
          price: number | null;
          price_label: string | null;
          location: string;
          images: string[];
          status: string;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["listings"]["Row"]> & { owner_id: string; type: ListingType; title: string; category: string; location: string };
        Update: Partial<Database["public"]["Tables"]["listings"]["Row"]>;
        Relationships: [];
      };
      business_profiles: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          category: string;
          location: string;
          distance_label: string | null;
          opens_at: string | null;
          closes_at: string | null;
          phone: string | null;
          whatsapp: string | null;
          photos: string[];
          offer: string | null;
          verified: boolean;
          trust_score: number;
          rating: number;
          reviews_count: number;
          open_now: boolean;
          trending: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["business_profiles"]["Row"]> & { name: string; category: string; location: string };
        Update: Partial<Database["public"]["Tables"]["business_profiles"]["Row"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          worker_profile_id: string | null;
          business_profile_id: string | null;
          listing_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & { reviewer_id: string; rating: number };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_profile_id: string | null;
          listing_id: string | null;
          business_profile_id: string | null;
          reason: string;
          status: ReportStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reports"]["Row"]> & { reporter_id: string; reason: string };
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          title: string;
          body: string | null;
          read_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & { profile_id: string; type: string; title: string };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          points_awarded: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["referrals"]["Row"]> & { referrer_id: string; referred_id: string };
        Update: Partial<Database["public"]["Tables"]["referrals"]["Row"]>;
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_audit_logs"]["Row"]> & { admin_id: string; action: string };
        Update: Partial<Database["public"]["Tables"]["admin_audit_logs"]["Row"]>;
        Relationships: [];
      };
      worker_live_locations: {
        Row: {
          worker_profile_id: string;
          latitude: number;
          longitude: number;
          is_online: boolean;
          last_seen_at: string;
          update_interval_seconds: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["worker_live_locations"]["Row"]> & { worker_profile_id: string; latitude: number; longitude: number };
        Update: Partial<Database["public"]["Tables"]["worker_live_locations"]["Row"]>;
        Relationships: [];
      };
      instant_bookings: {
        Row: {
          id: string;
          customer_id: string;
          worker_profile_id: string | null;
          service_type: string;
          latitude: number;
          longitude: number;
          radius_km: number;
          status: BookingStatus;
          eta_minutes: number | null;
          accepted_at: string | null;
          locked_at: string | null;
          completed_at: string | null;
          fallback_phone: string | null;
          fallback_whatsapp: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["instant_bookings"]["Row"]> & { customer_id: string; service_type: string; latitude: number; longitude: number };
        Update: Partial<Database["public"]["Tables"]["instant_bookings"]["Row"]>;
        Relationships: [];
      };
      booking_requests: {
        Row: {
          id: string;
          booking_id: string;
          worker_profile_id: string;
          status: string;
          notified_at: string;
          responded_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["booking_requests"]["Row"]> & { booking_id: string; worker_profile_id: string };
        Update: Partial<Database["public"]["Tables"]["booking_requests"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: AppRole;
      listing_type: ListingType;
      report_status: ReportStatus;
      verification_status: VerificationStatus;
      notification_type: "profile_view" | "job_nearby" | "buyer_interest" | "trust_score" | "referral" | "admin";
      booking_status: BookingStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
