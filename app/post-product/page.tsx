import { ImagePlus, IndianRupee, MapPin, Upload } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/forms/form-fields";
import { SectionHeader } from "@/components/ui";

export const metadata = { title: "Post a Product" };

export default function PostProductPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Sell Nearby" title="List your item in minutes" description="Add price, condition, location, and seller verification details to build buyer confidence." />
          <div className="glass rounded-3xl p-5">
            <div className="grid aspect-video place-items-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-center">
                <ImagePlus className="mx-auto mb-3 h-8 w-8 text-saffron" />
                <p className="font-black">Placeholder product photos</p>
                <p className="text-sm text-zinc-500">Upload UI ready for real backend</p>
              </div>
            </div>
          </div>
        </div>
        <form className="glass grid gap-4 rounded-[2rem] p-5 sm:p-7">
          <TextField label="Product title" placeholder="Bike, mobile, sofa, shop for rent..." />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Category" options={["Mobile", "Bike", "Car", "Furniture", "Property", "Appliance", "Tools"]} />
            <TextField label="Price" placeholder="Rs 12,000" icon={<IndianRupee className="h-4 w-4" />} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Condition" options={["New", "Excellent", "Good", "Used", "Needs repair"]} />
            <TextField label="Location" placeholder="Area, city" icon={<MapPin className="h-4 w-4" />} />
          </div>
          <TextAreaField placeholder="Describe brand, age, documents, pickup, reason for selling..." />
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white dark:bg-white dark:text-ink"><Upload className="h-4 w-4" /> Sell Your Item</button>
        </form>
      </div>
    </section>
  );
}
