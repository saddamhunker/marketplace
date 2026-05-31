import type { ChangeEvent, ReactNode } from "react";

export function TextField({
  label,
  placeholder,
  icon,
  type = "text",
  name,
  value,
  required,
  onChange
}: {
  label: string;
  placeholder: string;
  icon?: ReactNode;
  type?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-black">
      {label}
      <span className="flex min-w-0 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        {icon}
        <input
          className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400"
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      </span>
    </label>
  );
}

export function SelectField({
  label,
  options,
  name,
  value,
  required,
  onChange
}: {
  label: string;
  options: string[];
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-black">
      {label}
      <select
        className="min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-saffron dark:border-zinc-800 dark:bg-zinc-950"
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function TextAreaField({
  placeholder,
  name,
  value,
  required,
  onChange
}: {
  placeholder: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      className="min-h-32 w-full min-w-0 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-saffron dark:border-zinc-800 dark:bg-zinc-950"
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      value={value}
    />
  );
}
