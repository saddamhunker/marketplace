import { Star } from "lucide-react";

export function ReviewCard({ review }: { review: { name: string; rating: number; text: string; city: string } }) {
  return (
    <article className="glass rounded-3xl p-5">
      <div className="mb-3 flex gap-1 text-amber-400">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">&ldquo;{review.text}&rdquo;</p>
      <p className="mt-4 font-black">{review.name}</p>
      <p className="text-xs text-zinc-500">{review.city}</p>
    </article>
  );
}
