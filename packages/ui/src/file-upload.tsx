import { forwardRef, useRef, ChangeEvent, useState } from 'react';
import { Input, Label } from '.';
import { UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  id: string;
  labelRef?: React.RefObject<HTMLLabelElement>;
  onChange?: (files: FileList | null) => void;
  className?: string;
  accept?: string;
  helperText?: string;
}

const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ id, labelRef, onChange, className, accept, helperText }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState('No file chosen');

    // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //   const files = e.target.files;
    //   if (labelRef?.current && files && files.length > 0) {
    //     labelRef.current.textContent = Array.from(files)
    //       .map((file) => file.name)
    //       .join(', ');
    //   }
    //   onChange?.(files);
    // };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const name = Array.from(files)
          .map((file) => file.name)
          .join(', ');
        setFileName(name);
      } else {
        setFileName('No file chosen');
      }

      onChange?.(files);
    };

    return (
      <div className={className}>
        <Input
          type='file'
          id={id}
          ref={(node: any) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref && 'current' in ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node;
            }
            // inputRef.current = node; // Removed to fix read-only assignment error
          }}
          onChange={handleChange}
          className='hidden'
          accept={accept}
        />
        <Label
          htmlFor={id}
          className='
            flex items-center h-11 w-full border border-gray-300 rounded-md 
            bg-white text-sm text-gray-700 cursor-pointer 
            hover:border-gray-400 transition gap-2
          '
        >
          <div className='flex items-center px-3 gap-2 bg-gray-100 h-full border border-gray-200'>
            <UploadCloud className='w-4 h-4 text-gray-500 shrink-0' />
            <span className='text-[#4500FF] text-[14px] font-medium'>
              Choose file
            </span>
          </div>
          <span className='ml-1 text-gray-600 truncate'>{fileName}</span>
        </Label>
        {helperText && fileName === 'No file chosen' && (
          <p className='mt-1 text-xs text-gray-500'>{helperText}</p>
        )}
      </div>
    );
  }
);

FileUploader.displayName = 'FileUploader';

export default FileUploader;
