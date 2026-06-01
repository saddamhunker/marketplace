"use client";

import { useState } from "react";
import { Film, Send, Upload, X } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/forms/form-fields";
import { workerCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const categories = workerCategories.map((category) => category.name);
const maxVideoSizeMb = 50;

export function ServiceVideoUploadForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function selectVideo(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setStatus("Sirf video file upload karo.");
      return;
    }
    if (file.size > maxVideoSizeMb * 1024 * 1024) {
      setStatus(`Video ${maxVideoSizeMb}MB se chhota hona chahiye.`);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus("Video ready. Ab publish kar sakte ho.");
  }

  async function uploadVideo(sessionToken: string, userId: string) {
    if (!videoFile) throw new Error("Pehle video choose karo.");

    const extension = videoFile.name.split(".").pop()?.toLowerCase() || "mp4";
    const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("service-videos").upload(path, videoFile, {
      cacheControl: "31536000",
      contentType: videoFile.type,
      upsert: false
    });

    if (error) {
      throw new Error(error.message.includes("Bucket not found") ? "Supabase mein service-videos bucket create/run SQL karo." : error.message);
    }

    const { data } = supabase.storage.from("service-videos").getPublicUrl(path);
    if (!data.publicUrl) throw new Error("Video public URL nahi mila.");

    return { videoUrl: data.publicUrl, sessionToken };
  }

  async function submitVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Uploading reel...");

    try {
      if (!isSupabaseConfigured()) {
        setStatus("Supabase env missing hai. Reel upload ke liye Supabase required hai.");
        return;
      }

      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        setStatus("Pehle login karo, phir worker reel upload hoga.");
        return;
      }

      const { videoUrl, sessionToken } = await uploadVideo(session.access_token, session.user.id);
      const response = await fetch("/api/service-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ title, category, description, videoUrl })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(payload.error ?? "Reel save nahi hua. Worker profile aur Supabase schema check karo.");
        return;
      }

      setTitle("");
      setDescription("");
      setVideoFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setStatus("Reel uploaded. Homepage Short Service Videos mein show hoga.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed. Thoda der baad try karo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="videos" onSubmit={submitVideo} className="scroll-mt-28 glass grid gap-4 rounded-[2rem] p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron/10 text-saffron">
          <Film className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-black">Upload Service Reel</h2>
          <p className="text-sm font-semibold text-zinc-500">Before/after, repair tips, completed job proof, ya short demo video upload karo.</p>
        </div>
      </div>

      <label className="grid gap-3 text-sm font-black">
        Reel video
        <span className="grid min-h-52 cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-4 text-center transition hover:border-saffron dark:border-zinc-800 dark:bg-zinc-950">
          <input accept="video/*" className="sr-only" onChange={(event) => selectVideo(event.target.files?.[0] ?? null)} type="file" />
          {previewUrl ? (
            <video className="max-h-72 w-full rounded-2xl object-cover" controls muted playsInline src={previewUrl} />
          ) : (
            <span>
              <Upload className="mx-auto mb-3 h-8 w-8 text-saffron" />
              <span className="block font-black">Choose reel video</span>
              <span className="mt-1 block text-xs font-semibold text-zinc-500">MP4/WebM preferred, up to {maxVideoSizeMb}MB</span>
            </span>
          )}
        </span>
      </label>

      {videoFile ? (
        <button type="button" onClick={() => { setVideoFile(null); setPreviewUrl(""); }} className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-xs font-black dark:bg-zinc-800">
          <X className="h-3.5 w-3.5" /> Remove video
        </button>
      ) : null}

      <TextField label="Reel title" placeholder="AC gas refill before/after..." required value={title} onChange={(event) => setTitle(event.target.value)} />
      <SelectField label="Service category" options={categories} value={category} onChange={(event) => setCategory(event.target.value)} />
      <TextAreaField placeholder="Short caption: kaam kya tha, area, timing, proof..." value={description} onChange={(event) => setDescription(event.target.value)} />

      {status ? <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{status}</p> : null}

      <button disabled={submitting || !videoFile} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-ink">
        <Send className="h-4 w-4" />
        {submitting ? "Uploading..." : "Publish Reel"}
      </button>
    </form>
  );
}
