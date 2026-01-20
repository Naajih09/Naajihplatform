import * as React from 'react';

import { cn } from '.';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hideBorders?: boolean;
  variant?: 'filled' | 'outline';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hideBorders, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-[12px]',
          'px-3 py-2 text-sm ring-offset-background placeholder:text-brand-gray-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border border-input': !hideBorders,
            'bg-transparent': variant === 'outline',
            'bg-[#F5F7F9]': variant === 'filled',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
