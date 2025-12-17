import * as React from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn, Input } from '.';

type InputProps = {
  name: string;
  label?: string;
  labelClassName?: string;
  error?: FieldError | undefined;
  isRequired?: boolean;
  isPhone?: boolean;
  containerClass?: string;
  type?: string;
  info?: boolean;
  infoMessage?: string;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref): React.ReactElement => {
    const {
      label,
      labelClassName,
      isRequired,
      error,
      isPhone,
      containerClass,
      type,
      info,
      icon,
      infoMessage,
      ...inputProps
    } = props;

    const [showPassword, setShowPassword] = useState(false);

    const getInputType = () => {
      if (type === 'password') {
        return showPassword ? 'text' : 'password';
      }
      return type || 'text';
    };

    return (
      <div className={cn('w-full mb-4', containerClass)}>
        {label && (
          <div className='flex items-center gap-1'>
            {isRequired && (
              <span className={cn('text-sm text-red-500 mb-2', labelClassName)}>
                *
              </span>
            )}
            <label
              className={cn(
                'text-sm font-medium text-gray-700 capitalize',
                labelClassName
              )}
              htmlFor={inputProps.id}
            >
              {label}
            </label>
          </div>
        )}

        <div className='!relative'>
          {icon && <div className='absolute left-3 top-3'>{icon}</div>}

          <Input
            type={getInputType()}
            ref={ref}
            className={cn(
              '  block w-full rounded-md border px-3 h-11 text-gray-700 shadow-sm focus:outline-none focus:ring-1',
              icon && 'pl-10',
              error
                ? 'border-red-400 focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
              inputProps.className
            )}
            {...inputProps}
            autoCapitalize={type === 'email' ? 'off' : undefined}
          />
          {type === 'password' && (
            <button
              type='button'
              className='!absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          )}
        </div>

        {error && <p className='mt-1 text-sm text-red-600'>{error.message}</p>}
        {info && <p className='mt-1 text-sm text-red-600'>{infoMessage}</p>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

type OmitTextField = Omit<InputProps, 'name' | 'error' | 'onChange'> & {
  subText?: string;
  isNumber?: boolean;
  icon?: React.ReactNode;
};

interface IControllTextInput<
  TFieldValues extends FieldValues,
> extends OmitTextField {
  errors?: Partial<FieldErrorsImpl<TFieldValues>>;
  control: Control<TFieldValues, any>;
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControllTextInput = <TFormValue extends FieldValues>(
  props: IControllTextInput<TFormValue>
): React.ReactElement => {
  const { name, control, label, rules, isNumber, ...rest } = props;

  const onNumberValidator = (
    value: string,
    onChange: (value: string) => void
  ) => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numeric input
    onChange(numericValue);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { ref, onChange, value, ...field },
        fieldState: { error },
      }) => (
        <TextField
          ref={ref}
          label={label}
          error={error}
          value={value || ''}
          icon={rest.icon}
          onChange={(e) =>
            isNumber
              ? onNumberValidator(e.target.value, onChange)
              : onChange(e.target.value)
          }
          {...rest}
          {...field}
        />
      )}
    />
  );
};
