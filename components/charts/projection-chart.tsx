"use client";

import { useId } from "react";

import { cn, formatCompactBRL } from "@/lib/utils";

export type ChartSeries = {
  label: string;
  color: string;
  values: number[];
  /** Preenchimento de área sob a linha. */
  fill?: boolean;
};

type ProjectionChartProps = {
  series: ChartSeries[];
  ariaLabel: string;
  className?: string;
};

const WIDTH = 720;
const HEIGHT = 300;
const PADDING = { top: 20, right: 16, bottom: 34, left: 62 };

function niceMax(value: number) {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];
  const step = steps.find((candidate) => candidate >= normalized) ?? 10;
  return step * magnitude;
}

export function ProjectionChart({ series, ariaLabel, className }: ProjectionChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const pointCount = Math.max(...series.map((item) => item.values.length), 2);
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const rawMax = Math.max(...series.flatMap((item) => item.values), 1);
  const maxValue = niceMax(rawMax);
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const xFor = (index: number) => PADDING.left + (index / (pointCount - 1)) * innerWidth;
  const yFor = (value: number) =>
    PADDING.top + innerHeight - (Math.max(value, 0) / maxValue) * innerHeight;

  const xTickIndexes = [
    0,
    Math.floor((pointCount - 1) / 3),
    Math.floor(((pointCount - 1) * 2) / 3),
    pointCount - 1,
  ];
  const monthsPerPoint = pointCount - 1;

  const labelForMonth = (index: number) => {
    const months = Math.round((index / monthsPerPoint) * 120);
    if (index === 0) return "hoje";
    if (months >= 12 && months % 12 === 0) return `${months / 12} anos`;
    return `${months} meses`;
  };

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className="h-auto w-full overflow-visible"
      >
        <defs>
          {series.map((item, index) => (
            <linearGradient
              key={item.label}
              id={`${gradientId}-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={item.color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {yTicks.map((tick) => {
          const y = PADDING.top + innerHeight * (1 - tick);
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-line"
                strokeDasharray={tick === 0 ? undefined : "4 6"}
              />
              <text
                x={PADDING.left - 12}
                y={y + 4}
                textAnchor="end"
                className="fill-muted text-[11px]"
              >
                {formatCompactBRL(maxValue * tick)}
              </text>
            </g>
          );
        })}

        {series.map((item, index) => {
          const points = item.values.map(
            (value, pointIndex) => `${xFor(pointIndex)},${yFor(value)}`,
          );
          const line = `M ${points.join(" L ")}`;
          const area = `${line} L ${xFor(item.values.length - 1)},${yFor(0)} L ${xFor(0)},${yFor(0)} Z`;

          return (
            <g key={item.label}>
              {item.fill ? <path d={area} fill={`url(#${gradientId}-${index})`} /> : null}
              <path
                d={line}
                fill="none"
                stroke={item.color}
                strokeWidth={index === 0 ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={item.fill ? undefined : "6 5"}
              />
            </g>
          );
        })}

        {xTickIndexes.map((index) => (
          <text
            key={index}
            x={xFor(index)}
            y={HEIGHT - 8}
            textAnchor={index === 0 ? "start" : index === pointCount - 1 ? "end" : "middle"}
            className="fill-muted text-[11px]"
          >
            {labelForMonth(index)}
          </text>
        ))}
      </svg>

      <figcaption className="text-muted mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {series.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-0.5 w-5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
