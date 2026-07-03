"use client";

import type { ReactNode } from "react";

export function Legend({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <legend className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-energia">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-energia/15 text-energia">
        {icon}
      </span>
      {children}
    </legend>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoFocus?: boolean;
  icon?: ReactNode;
  suffix?: string;
  hint?: string;
};

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  inputMode,
  autoFocus,
  icon,
  suffix,
  hint,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-aco-400">
        {label}
        {required && <span className="ml-1 text-energia">*</span>}
      </span>
      <div className="group flex items-center gap-2 rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 transition focus-within:border-energia/40 focus-within:bg-petroleo-700/70">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-gelo placeholder:text-aco-500/70 outline-none"
        />
        {suffix && (
          <span className="text-xs font-medium text-aco-500">{suffix}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-aco-500">{hint}</p>}
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  hint?: string;
};

export function Select({
  label,
  value,
  onChange,
  required,
  children,
  icon,
  hint,
}: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-aco-400">
        {label}
        {required && <span className="ml-1 text-energia">*</span>}
      </span>
      <div className="flex items-center gap-2 rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 transition focus-within:border-energia/40 focus-within:bg-petroleo-700/70">
        {icon}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none bg-transparent text-sm text-gelo outline-none [&>option]:bg-grafite-800 [&>option]:text-gelo"
        >
          {children}
        </select>
      </div>
      {hint && <p className="mt-1 text-[11px] text-aco-500">{hint}</p>}
    </label>
  );
}

type RadioCardsProps<T extends string> = {
  name: string;
  value: T;
  options: { value: T; label: string; description?: string }[];
  onChange: (value: T) => void;
  columns?: 1 | 2;
};

export function RadioCards<T extends string>({
  name,
  value,
  options,
  onChange,
  columns = 2,
}: RadioCardsProps<T>) {
  return (
    <div
      className={`grid grid-cols-1 gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`cursor-pointer rounded-2xl border p-3 text-sm transition ${
            value === opt.value
              ? "border-energia/60 bg-energia/10 text-gelo"
              : "border-gelo/10 bg-grafite/40 text-aco-400 hover:border-gelo/25"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <span className="block font-medium">{opt.label}</span>
          {opt.description && (
            <span className="mt-1 block text-xs text-aco-500">{opt.description}</span>
          )}
        </label>
      ))}
    </div>
  );
}

export function ChipOptions<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            value === opt.value
              ? "border-energia/60 bg-energia/10 text-gelo"
              : "border-gelo/10 bg-grafite/40 text-aco-400 hover:border-gelo/25"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
