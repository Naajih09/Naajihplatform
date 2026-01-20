'use client';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { cn } from '.';

type TabSelectItemProps = {
  label: string;
  onSelect(): void;
  isSelected: boolean;
};

function TabSelectItem({ isSelected, label, onSelect }: TabSelectItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex justify-center items-center px-[20px] py-[14px] rounded-[12px]',
        'text-[14px] border w-fit',
        isSelected
          ? 'text-brand-500 !bg-[#EAEDFE] border-brand-500'
          : 'text-brand-gray-200 bg-[#F5F7F9] border-0'
      )}
    >
      {label}
    </button>
  );
}

type TabMultiSelectProps<T> = {
  options: { label: string; value: T }[];
  // eslint-disable-next-line no-unused-vars
  handleChange?(v: T[]): void;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const _TabMultiSelect = <T,>(
  { options, handleChange }: TabMultiSelectProps<T>,
  ref: React.Ref<{ reset(): void }>
) => {
  const [selected, setSelected] = useState<T[]>([]);

  const handleSelect = (value: T) => {
    if (selected.includes(value)) {
      setSelected((prev) => prev.filter((v) => v !== value));
    } else {
      setSelected((prev) => [...prev, value]);
    }
  };

  useImperativeHandle(ref, () => ({
    reset() {
      setSelected([]);
    },
  }));

  const handleChangeRef = useRef(handleChange);
  handleChangeRef.current = handleChange;

  useEffect(() => {
    if (handleChangeRef.current) {
      handleChangeRef.current(selected);
    }
  }, [selected]);

  return (
    <div className={cn('w-full gap-3', 'flex flex-row flex-wrap')}>
      {options.map((o, i) => (
        <TabSelectItem
          key={i}
          onSelect={handleSelect.bind(null, o.value)}
          label={o.label}
          isSelected={selected.includes(o.value)}
        />
      ))}
    </div>
  );
};

export const TabMultiSelect = forwardRef(_TabMultiSelect) as <T>(
  props: TabMultiSelectProps<T> & { ref?: React.Ref<{ reset(): void }> }
) => React.ReactElement;
