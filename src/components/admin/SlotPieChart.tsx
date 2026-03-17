"use client";

interface Slice {
  label: string;
  value: number;
}

const COLORS = [
  "#c1440e", "#e07b54", "#8b4513", "#d2691e",
  "#a0522d", "#cd853f", "#deb887", "#f4a460", "#bc8f5f",
];

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start);
  const e = polarToCartesian(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

export default function SlotPieChart({ data }: { data: Slice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="font-sans text-sm text-clay-400">Sin datos para hoy.</p>;

  let angle = 0;
  const slices = data.map((d, i) => {
    const start = angle;
    const span = (d.value / total) * 360;
    angle += span;
    return { ...d, start, span, color: COLORS[i % COLORS.length] };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0">
        {slices.map((s) => (
          <path
            key={s.label}
            d={arcPath(80, 80, 72, s.start, s.start + s.span)}
            fill={s.color}
          />
        ))}
      </svg>
      <ul className="space-y-1.5">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="font-sans text-sm text-bark-900">{s.label} hs</span>
            <span className="font-sans text-sm text-clay-400 font-bold">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
