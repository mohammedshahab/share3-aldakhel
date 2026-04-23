"use client";

interface Point {
  day: string;
  total: number;
  breaking: number;
  featured: number;
}

export function ArticlesChart({ data }: { data: Point[] }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-6 text-center text-sm text-[var(--color-gray-light)]">
        لا توجد بيانات لعرضها بعد.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);
  const width = 800;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;

  const buildPath = (accessor: (p: Point) => number) =>
    data
      .map((d, i) => {
        const x = padding.left + step * i;
        const y = padding.top + innerH - (accessor(d) / max) * innerH;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div className="rounded-xl border border-white/5 bg-[var(--color-panel)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-[var(--font-cairo)] text-lg font-black text-white">
          الأخبار المنشورة — آخر 30 يوم
        </h3>
        <div className="flex items-center gap-3 text-xs text-[var(--color-gray-light)]">
          <Legend color="#c9a84c" label="مميز" />
          <Legend color="#e63946" label="عاجل" />
          <Legend color="#9a9a9a" label="كل الأخبار" />
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * p}
            y2={padding.top + innerH * p}
            stroke="#ffffff10"
          />
        ))}
        <path
          d={buildPath((d) => d.total)}
          stroke="#9a9a9a"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={buildPath((d) => d.breaking)}
          stroke="#e63946"
          strokeWidth="2"
          fill="none"
        />
        <path
          d={buildPath((d) => d.featured)}
          stroke="#c9a84c"
          strokeWidth="2"
          fill="none"
        />
        {data.map((d, i) => (
          <circle
            key={d.day}
            cx={padding.left + step * i}
            cy={padding.top + innerH - (d.total / max) * innerH}
            r="3"
            fill="#9a9a9a"
          />
        ))}
      </svg>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
