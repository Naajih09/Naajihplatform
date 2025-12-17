import * as SelectPrimitive from '@radix-ui/react-select';
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
import {
  cn,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '.';

// Re-export the types we need to avoid the TS4023 error
export interface SelectRootProps extends SelectPrimitive.SelectProps {}

// Define Props for the base Select component
export interface BaseSelectProps extends SelectRootProps {
  name: string;
  label?: string;
  labelClassName?: string;
  error?: FieldError | undefined;
  isRequired?: boolean;
  containerClass?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  onDropdownOpen?: () => void;
  onDropdownClose?: () => void;
  triggerClassName?: string;
  isLoading?: boolean;
}

// Base Select component
export const BaseSelect = React.forwardRef<HTMLButtonElement, BaseSelectProps>(
  (
    {
      label,
      labelClassName,
      isRequired,
      error,
      containerClass,
      options,
      onDropdownOpen,
      onDropdownClose,
      placeholder,
      triggerClassName,
      isLoading,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full mb-4', containerClass)}>
        {label && (
          <div className='flex items-center gap-1 '>
            {isRequired && (
              <span className={cn('text-sm text-red-500', labelClassName)}>
                *
              </span>
            )}
            <label
              className={cn(
                'text-sm font-medium text-gray-700 capitalize',
                labelClassName
              )}
              htmlFor={props.name}
            >
              {label}
            </label>
          </div>
        )}

        <Select
          {...props}
          onOpenChange={(open) => {
            if (open && onDropdownOpen) onDropdownOpen();
            if (!open && onDropdownClose) onDropdownClose();
          }}
        >
          <SelectTrigger
            className={cn(
              'w-full h-11',
              props.disabled && 'cursor-not-allowed',
              triggerClassName,
              error
                ? 'border-red-400 focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            )}
            ref={ref}
          >
            <SelectValue placeholder={placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {!isLoading ? (
              <SelectGroup>
                {options?.map((option: any) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <SelectGroup>
                <SelectItem value={String('')}>Fetching data...</SelectItem>
              </SelectGroup>
            )}
          </SelectContent>
        </Select>

        {error && <p className='mt-1 text-sm text-red-600'>{error.message}</p>}
      </div>
    );
  }
);

BaseSelect.displayName = 'BaseSelect';

// Omit some props for the controlled version
export interface ControlledSelectBaseProps
  extends Omit<BaseSelectProps, 'name' | 'error' | 'onValueChange'> {
  subText?: string;
}

// Controlled Select component
export interface ControlledSelectProps<TFieldValues extends FieldValues>
  extends ControlledSelectBaseProps {
  errors?: Partial<FieldErrorsImpl<TFieldValues>>;
  control: Control<TFieldValues, any>;
  name: Path<TFieldValues>;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export const ControlledSelect = <TFormValue extends FieldValues>({
  name,
  control,
  label,
  rules,
  options,
  ...rest
}: ControlledSelectProps<TFormValue>): React.ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, value, ref, ...field },
        fieldState: { error },
      }) => (
        <BaseSelect
          ref={ref}
          label={label}
          error={error}
          value={value}
          onDropdownOpen={() => setIsDropdownOpen(true)}
          onDropdownClose={() => setIsDropdownOpen(false)}
          onValueChange={onChange}
          options={options}
          {...rest}
          {...field}
        />
      )}
    />
  );
};
