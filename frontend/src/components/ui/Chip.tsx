import { ReactNode } from 'react';

export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wider transition-colors ${
      active
        ? 'bg-secondary/20 text-secondary border border-secondary/30'
        : 'bg-white/10 text-on-surface-variant border border-white/10'
    }`}>
      {children}
    </span>
  );
}
