// src/components/ui/Badge.jsx

/**
 * Badge component — EksposiLab Design System
 * Variants: done | active | locked | xp | streak
 */
export default function Badge({ variant = 'done', children, className = '' }) {
  const variantMap = {
    done:   'badge-done',
    active: 'badge-active',
    locked: 'badge-locked',
    xp:     'badge-xp',
    streak: 'badge-streak',
  };

  return (
    <span className={`badge ${variantMap[variant] || 'badge-done'} ${className}`}>
      {children}
    </span>
  );
}
