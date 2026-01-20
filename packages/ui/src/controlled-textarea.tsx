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

import { useState } from 'react';
import { cn } from '.';

import { Textarea } from './textarea';

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
} & React.InputHTMLAttributes<HTMLTextAreaElement>;

export const TextFieldArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
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

          <Textarea
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
        </div>

        {error && <p className='mt-1 text-sm text-red-600'>{error.message}</p>}
        {info && <p className='mt-1 text-sm text-red-600'>{infoMessage}</p>}
      </div>
    );
  }
);

TextFieldArea.displayName = 'TextFieldArea';

type OmitTextField = Omit<InputProps, 'name' | 'error' | 'onChange'> & {
  subText?: string;
  isNumber?: boolean;
  icon?: React.ReactNode;
};

interface IControllTextInput<TFieldValues extends FieldValues>
  extends OmitTextField {
  errors?: Partial<FieldErrorsImpl<TFieldValues>>;
  control: Control<TFieldValues, any>;
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControllTextArea = <TFormValue extends FieldValues>(
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
        <TextFieldArea
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
