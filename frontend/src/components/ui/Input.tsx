import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-white/5 border-b-2 border-outline-variant text-on-surface px-3 py-2.5 focus:border-secondary focus:outline-none focus:bg-white/8 transition-all placeholder:text-on-surface-variant/50 ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';
