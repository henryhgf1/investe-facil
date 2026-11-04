"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  hint?: string;
};

export function Slider({ label, value, min, max, step, display, onChange, hint }: SliderProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-ink text-sm font-medium">
          {label}
        </label>
        <output
          htmlFor={id}
          className="bg-brand-50 text-brand-800 rounded-lg px-2.5 py-1 font-mono text-sm font-semibold tabular-nums"
        >
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cn(
          "accent-brand-600 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200",
          "focus-visible:outline-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4",
        )}
      />
      {hint ? <p className="text-muted text-xs">{hint}</p> : null}
    </div>
  );
}
