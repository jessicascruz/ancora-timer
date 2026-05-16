interface Props {
  progress: number;
  state: 'focus' | 'break';
  label: string;
}

export function CircularProgress({ progress, state, label }: Props) {
  const color = state === 'focus' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const trackColor = state === 'focus' ? 'rgba(196,193,251,0.1)' : 'rgba(78,222,163,0.1)';
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke={trackColor} strokeWidth="12" />
        <circle
          cx="100" cy="100" r={radius} fill="none" stroke={color}
          strokeWidth="12" strokeDasharray={circumference}
          strokeDashoffset={offset} strokeLinecap="butt"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-bold text-4xl text-on-surface tracking-tight">{label}</span>
      </div>
    </div>
  );
}
