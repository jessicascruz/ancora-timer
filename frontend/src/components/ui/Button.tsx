import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  state?: 'focus' | 'break';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', state = 'focus', className = '', ...props }, ref) => {
    const base = 'font-display font-medium text-sm tracking-wide transition-all duration-200 rounded-md px-5 py-2.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-primary';

    const variants: Record<Variant, string> = {
      primary: state === 'focus'
        ? 'bg-primary text-on-primary hover:bg-primary/90'
        : 'bg-secondary text-on-secondary hover:bg-secondary/90',
      secondary: state === 'focus'
        ? 'bg-primary-container text-primary hover:bg-primary-container/80'
        : 'bg-secondary-container text-on-secondary hover:bg-secondary-container/80',
      ghost: 'bg-white/5 text-on-surface border border-white/20 hover:bg-white/10',
    };

    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = 'Button';
