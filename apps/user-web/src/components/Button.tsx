import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  className = '',
  isLoading,
  ...props
}: ButtonProps) => {
  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary: `
      bg-primary text-neutral-dark
      hover:brightness-110
      shadow-md shadow-primary/20
    `,
    secondary: `
      bg-amber-400 text-slate-900
      hover:bg-amber-300
    `,
    outline: `
      border border-slate-300 text-slate-700
      hover:border-primary hover:text-primary
      dark:border-slate-600 dark:text-slate-300
    `,
    ghost: `
      text-slate-600 hover:bg-slate-100
      dark:text-slate-400 dark:hover:bg-white/5
    `,
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
};

export default Button;
