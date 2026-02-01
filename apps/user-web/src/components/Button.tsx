import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', isLoading, ...props }: any) => {
  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants: any = {
    primary: "bg-[#9dd926] text-[#151712] hover:brightness-110 shadow-md",
    secondary: "bg-[#FFC107] text-[#0D47A1] hover:bg-yellow-400",
    outline: "border border-gray-600 text-gray-300 hover:border-primary hover:text-primary",
    ghost: "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
};

export default Button;