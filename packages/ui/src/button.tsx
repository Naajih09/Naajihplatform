import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '.';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-brand/80',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'bg-[#F9F9F9] text-black hover:bg-[#F9F9F9]/80',
        link: 'text-primary underline-offset-4 hover:underline',
        register:
          'bg-[#4500FF] disabled:bg-gray-100 disabled:text-gray-300 text-white hover:bg-[#4500FF]',
      },
      size: {
        default: 'h-[40px] px-[16px] py-[8px]',
        sm: 'h-[36px] rounded-md px-[12px]',
        lg: 'h-[44px] rounded-md px-[28px]',
        icon: 'h-[40px] w-[40px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      isDisabled = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled || disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className='flex items-center flex-wrap box-border mr-[8px]'>
              <span className='inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
            </div>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
