import { ReactNode } from 'react';

export default function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass-panel p-6 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}
