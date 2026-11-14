import { useMemo } from "react";

/**
 * Swiss kinetic wave / moiré divider (design rulebook §1.3):
 * subtle monochrome line-art at low opacity for hero headers and
 * section dividers. Pure SVG, no images.
 */
export default function KineticWave({
  lines = 12,
  width = 1600,
  height = 320,
  amp = 46,
  opacity = 0.06,
  animated = true,
}: {
  lines?: number;
  width?: number;
  height?: number;
  amp?: number;
  opacity?: number;
  animated?: boolean;
}) {
  const paths = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < lines; i++) {
      const y = (height / (lines + 1)) * (i + 1);
      const phase = (i / lines) * Math.PI * 2;
      const a = amp * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7)));
      let d = `M 0 ${y.toFixed(1)}`;
      const step = 40;
      for (let x = step; x <= width; x += step) {
        const midY = y + a * Math.sin(phase + (x / width) * Math.PI * 6);
        d += ` Q ${(x - step / 2).toFixed(1)} ${midY.toFixed(1)} ${x} ${y.toFixed(1)}`;
      }
      out.push(d);
    }
    return out;
  }, [lines, width, height, amp]);

  return (
    <svg
      className={`kinetic-wave ${animated ? "is-animated" : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
