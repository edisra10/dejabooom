"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TripProfileOption } from "../types";

interface FieldErrorProps {
  id: string;
  message?: string;
}

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
}

export function TextField({
  id,
  label,
  value,
  error,
  placeholder,
  autoComplete,
  onChange,
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
}

export function TextAreaField({
  id,
  label,
  value,
  error,
  placeholder,
  rows = 4,
  onChange,
}: TextAreaFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]",
          error && "border-red-600 ring-red-100",
        )}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  error?: string;
  min?: number;
  max?: number;
  readOnly?: boolean;
  onChange: (value: number) => void;
}

export function NumberField({
  id,
  label,
  value,
  error,
  min,
  max,
  readOnly,
  onChange,
}: NumberFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(readOnly && "bg-slate-100 text-slate-600")}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function DateField({ id, label, value, error, onChange }: DateFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface SelectFieldProps<TValue extends string> {
  id: string;
  label: string;
  value: TValue;
  options: TripProfileOption<TValue>[];
  error?: string;
  onChange: (value: TValue) => void;
}

export function SelectField<TValue extends string>({
  id,
  label,
  value,
  options,
  error,
  onChange,
}: SelectFieldProps<TValue>) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-white px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
          error && "border-red-600 ring-red-100",
        )}
        onChange={(event) => onChange(event.target.value as TValue)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface ChoiceGroupProps<TValue extends string> {
  name: string;
  label: string;
  value: TValue;
  options: TripProfileOption<TValue>[];
  error?: string;
  columns?: "two" | "four";
  onChange: (value: TValue) => void;
}

export function ChoiceGroup<TValue extends string>({
  name,
  label,
  value,
  options,
  error,
  columns = "two",
  onChange,
}: ChoiceGroupProps<TValue>) {
  const errorId = `${name}-error`;

  return (
    <fieldset className="space-y-3" aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium">{label}</legend>
      <div
        className={cn(
          "grid gap-3",
          columns === "four" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2",
        )}
      >
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-md border bg-white p-4 text-sm shadow-sm transition hover:border-slate-400",
                selected && "border-slate-950 bg-slate-950 text-white",
                error && "border-red-300",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                className="sr-only"
                onChange={() => onChange(option.value)}
              />
              <span className="block font-semibold">{option.label}</span>
              {option.description ? (
                <span
                  className={cn(
                    "mt-1 block text-xs leading-5 text-slate-500",
                    selected && "text-slate-200",
                  )}
                >
                  {option.description}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

interface CheckboxGroupProps {
  name: string;
  label: string;
  values: string[];
  options: readonly string[];
  error?: string;
  onToggle: (value: string) => void;
}

export function CheckboxGroup({
  name,
  label,
  values,
  options,
  error,
  onToggle,
}: CheckboxGroupProps) {
  const errorId = `${name}-error`;

  return (
    <fieldset className="space-y-3" aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = values.includes(option);

          return (
            <label
              key={option}
              className={cn(
                "cursor-pointer rounded-md border px-3 py-2 text-sm transition hover:border-slate-400",
                checked
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700",
                error && "border-red-300",
              )}
            >
              <input
                type="checkbox"
                name={name}
                value={option}
                checked={checked}
                className="sr-only"
                onChange={() => onToggle(option)}
              />
              {option}
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

