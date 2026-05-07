// src/components/ui/ProgressBar.jsx

/**
 * ProgressBar component — EksposiLab Design System
 * Always shows percentage label on the right.
 */
export default function ProgressBar({ value = 0, max = 100, className = '' }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[12px] font-sans font-black shrink-0">{pct}%</span>
    </div>
  );
}
