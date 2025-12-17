import { Input } from '.';

interface KeyValueInputProps {
  keyValue: string;
  onKeyChange: (key: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export const KeyValueInput = ({
  keyValue,
  onKeyChange,
  value,
  onValueChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueInputProps) => {
  return (
    <div className='flex gap-2 w-full'>
      <Input
        value={keyValue}
        onChange={(e) => onKeyChange(e.target.value)}
        placeholder={keyPlaceholder}
        className='flex-1'
      />
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={valuePlaceholder}
        className='flex-1'
      />
    </div>
  );
};
