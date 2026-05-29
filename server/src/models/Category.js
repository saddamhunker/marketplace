import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    fields: [{ key: String, label: String, type: String, required: Boolean }]
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
