"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, IndianRupee, MapPin, Send, Upload, X } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/forms/form-fields";
import { marketplaceCategories, workerCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type ListingMode = "product" | "job";

type FormState = {
  title: string;
  category: string;
  price: string;
  condition: string;
  location: string;
  description: string;
  neededBy: string;
};

const productCategories = [...marketplaceCategories.map((category) => category.name), "Appliance", "Tools", "Electronics"];
const jobCategories = workerCategories.map((category) => category.name);
const conditions = ["New", "Excellent", "Good", "Used", "Needs repair"];

function parsePrice(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.onload = () => {
        const maxSide = 900;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Image compression failed"));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => reject(new Error("Image read failed"));
      image.src = String(reader.result);
    };

    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

export function ListingPostForm({ mode }: { mode: ListingMode }) {
  const router = useRouter();
  const categories = mode === "product" ? productCategories : jobCategories;
  const photoInputId = `${mode}-photo-input`;
  const [form, setForm] = useState<FormState>({
    title: "",
    category: categories[0],
    price: "",
    condition: conditions[2],
    location: "",
    description: "",
    neededBy: ""
  });
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isProduct = mode === "product";
  const submitLabel = isProduct ? "Sell Your Item" : "Post Your Work";
  const successLabel = isProduct ? "Listing posted. Marketplace khul raha hai..." : "Job posted. Nearby workers ko request ready hai...";

  const previewText = useMemo(() => {
    if (images.length) return `${images.length} photo selected`;
    return isProduct ? "Add product photos" : "Add job/site photos";
  }, [images.length, isProduct]);

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setStatus("Photos prepare ho rahi hain...");
    const selected = Array.from(files).slice(0, 4);
    try {
      const nextImages = await Promise.all(selected.map(fileToDataUrl));
      setImages(nextImages);
      setStatus("Photos ready. Ab submit kar sakte ho.");
    } catch {
      setStatus("Photo read nahi ho payi. Dusri image try karo.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Saving...");

    const priceLabel = form.price ? (form.price.toLowerCase().includes("rs") ? form.price : `Rs ${form.price}`) : null;
    const description = [form.description, !isProduct && form.neededBy ? `Needed by: ${form.neededBy}` : null]
      .filter(Boolean)
      .join("\n");

    try {
      const session = isSupabaseConfigured() ? (await createClient().auth.getSession()).data.session : null;
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          type: mode,
          title: form.title,
          category: form.category,
          description,
          price: parsePrice(form.price),
          priceLabel,
          location: form.location,
          images
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload.error === "Authentication required"
          ? "Pehle login/register karo, phir listing submit hogi."
          : payload.error ?? "Submit failed. Supabase schema/env check karo.";
        setStatus(message);
        return;
      }

      setStatus(successLabel);
      const createdId = payload.data?.id;
      router.push(isProduct && createdId ? `/products/${createdId}` : isProduct ? `/marketplace?posted=1&ts=${Date.now()}` : "/dashboard?posted=job");
      router.refresh();
    } catch {
      setStatus("Network issue. Local server aur Supabase connection check karo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass grid gap-4 rounded-[2rem] p-5 sm:p-7">
      <label className="grid gap-3 text-sm font-black">
        Photos
        <span className="grid min-h-44 cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-4 text-center transition hover:border-saffron dark:border-zinc-800 dark:bg-zinc-950">
          <input id={photoInputId} accept="image/*" className="sr-only" multiple onChange={(event) => handleFiles(event.target.files)} type="file" />
          {images.length ? (
            <span className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
              {images.map((image, index) => (
                <span key={image.slice(0, 40)} className="relative overflow-hidden rounded-2xl bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={`Upload preview ${index + 1}`} className="h-28 w-full object-cover" src={image} />
                </span>
              ))}
            </span>
          ) : (
            <span>
              <ImagePlus className="mx-auto mb-3 h-8 w-8 text-saffron" />
              <span className="block font-black">{previewText}</span>
              <span className="mt-1 block text-xs font-semibold text-zinc-500">Up to 4 images, instant preview</span>
            </span>
          )}
        </span>
      </label>

      {images.length ? (
        <button type="button" onClick={() => setImages([])} className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-xs font-black dark:bg-zinc-800">
          <X className="h-3.5 w-3.5" /> Remove photos
        </button>
      ) : null}

      <TextField
        label={isProduct ? "Product title" : "Work title"}
        name="title"
        onChange={(event) => updateField("title", event.target.value)}
        placeholder={isProduct ? "Bike, mobile, sofa, shop for rent..." : "Fan repair, pipe leakage, house painting..."}
        required
        value={form.title}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Category" name="category" onChange={(event) => updateField("category", event.target.value)} options={categories} value={form.category} />
        <TextField label={isProduct ? "Price" : "Budget"} name="price" onChange={(event) => updateField("price", event.target.value)} placeholder={isProduct ? "Rs 12,000" : "Rs 500 - 1200"} icon={<IndianRupee className="h-4 w-4" />} value={form.price} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isProduct ? (
          <SelectField label="Condition" name="condition" onChange={(event) => updateField("condition", event.target.value)} options={conditions} value={form.condition} />
        ) : (
          <TextField label="Needed by" name="neededBy" onChange={(event) => updateField("neededBy", event.target.value)} placeholder="Today 6 PM" value={form.neededBy} />
        )}
        <TextField label="Location" name="location" onChange={(event) => updateField("location", event.target.value)} placeholder="Area, city" icon={<MapPin className="h-4 w-4" />} required value={form.location} />
      </div>

      <TextAreaField
        name="description"
        onChange={(event) => updateField("description", event.target.value)}
        placeholder={isProduct ? "Describe brand, age, documents, pickup, reason for selling..." : "Describe the work, urgency, photos needed, preferred time..."}
        required
        value={form.description}
      />

      {status ? (
        <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{status}</p>
      ) : null}

      <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-ink">
        {isProduct ? <Upload className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
