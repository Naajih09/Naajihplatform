import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '.';
import { cn } from '.';
import { onNumberValidator } from '.';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean;
  isnumber?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showPasswordToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className='relative'>
        <input
          type={showPassword ? 'text' : type}
          className={cn(
            'flex h-[50px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            showPasswordToggle && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
          onChange={
            props.isnumber && props.onChange
              ? (e: React.ChangeEvent<HTMLInputElement>) => {
                  onNumberValidator(e, props.onChange as any);
                }
              : props.onChange
          }
        />
        {showPasswordToggle && type === 'password' && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-0 top-0 h-full px-3 py-1 text-[#909090] bg-transparent hover:bg-transparent focus-visible:ring-0'
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </Button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
