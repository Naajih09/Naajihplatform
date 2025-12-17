import React from 'react';

const Button = ({ children, variant = 'primary', className = '', isLoading, ...props }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-blue-900 shadow-md shadow-blue-900/10",
    secondary: "bg-brand-gold text-brand-blue hover:bg-yellow-400",
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-blue-50",
    ghost: "text-brand-gray hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;