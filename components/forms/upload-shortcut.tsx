"use client";

import { ImagePlus } from "lucide-react";

export function UploadShortcut({
  inputId,
  title,
  description
}: {
  inputId: string;
  title: string;
  description: string;
}) {
  function openPicker() {
    document.getElementById(inputId)?.click();
  }

  return (
    <button
      type="button"
      onClick={openPicker}
      className="grid aspect-video w-full place-items-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white text-center transition hover:border-saffron hover:bg-saffron/5 focus:outline-none focus:ring-4 focus:ring-saffron/20 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-saffron/10"
    >
      <span>
        <ImagePlus className="mx-auto mb-3 h-8 w-8 text-saffron" />
        <span className="block font-black">{title}</span>
        <span className="mt-1 block text-sm text-zinc-500">{description}</span>
      </span>
    </button>
  );
}
