import { CloudUpload, X } from 'lucide-react';
import { useCallback } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';

import { Button, cn } from '.';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export function formatMB(size: number) {
  return `${size / (1024 * 1024)}MB`;
}

type FilePickerProps = {
  onChange: (files: File[]) => void;
  accept?: Accept;
  files: File[];
  showSelections?: boolean;
  maxFileSize?: number;
  maxSelections?: number;
  isDisabled?: boolean;
  onError(msg: string): void;
  selectionDesc?: string;
  className?: string;
};

export function FilePicker({
  onChange,
  files,
  accept = {},
  maxFileSize = MAX_FILE_SIZE,
  maxSelections = 1,
  showSelections = false,
  isDisabled,
  selectionDesc,
  onError,
  className,
}: FilePickerProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (isDisabled) return;

      if (!acceptedFiles.every((file) => file.size <= maxFileSize))
        return onError(`File must be a maximum of ${formatMB(maxFileSize)}`);

      const newLength = files.length + acceptedFiles.length;

      if (newLength > maxSelections)
        return onError(
          `Only a maximum of ${maxSelections} selection(s) are allowed`
        );

      onChange([...files, ...acceptedFiles]);
    },
    [files, isDisabled, maxFileSize, maxSelections, onChange, onError]
  );

  const onDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      if (!rejections.length) return;

      const rejection = rejections[0];
      if (!rejection) return;

      const { errors } = rejection;

      const error = errors[0];
      if (!error) return;

      const { code } = error;

      if (code && code === 'file-too-large') {
        onError(`Files must be a maximum of ${maxFileSize}`);
      }
    },
    [maxFileSize, onError]
  );

  const onFileRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    multiple: maxSelections > 1,
    disabled: isDisabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full border-dashed border-[1px] border-[#E6E6E6] p-[18px]',
        'rounded-[18px] flex flex-col justify-center items-center text-center cursor-pointer',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="grid place-items-center bg-[#F9FAFB] h-[48px] w-[48px] rounded-full mb-[16px] shrink-0">
        <CloudUpload height={24} width={24} color="#475367" />
      </div>

      <p className="text-[14px] font-medium text-[#483D3D] mb-[8px]">
        <span className="text-[#000D65]">Browse a file</span> or drag and drop
        it here
      </p>

      <p className="text-[12px] text-[#A18D8E]">
        {selectionDesc || 'JPEG, PDF or PNG'} ({formatMB(maxFileSize)} max)
      </p>

      {showSelections && (
        <div className="w-full flex justify-start items-center gap-4 flex-wrap mt-10">
          {files.map((f, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-[#F9FAFB] flex justify-center items-center gap-1 hover:shadow-stroke-shadow transition-all"
            >
              <span className="text-[12px] text-[#483D3D]">{f.name}</span>

              <Button
                variant="ghost"
                size="icon"
                className="bg-transparent !size-[20px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove(i);
                }}
              >
                <X className="text-red-500 size-[16px]" />
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
