'use client';
import { useCallback, useMemo, useRef } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ExportIcon,
  arrayToExcel,
  flattenObject,
  arrayToPDF,
  cn,
} from '.';
import { useReactToPrint } from 'react-to-print';

const PrintPdfButton = ({
  htmlContent,
  isDisabled = false,
}: {
  htmlContent: string;
  isDisabled: boolean;
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <DropdownMenuItem
        className=' text-sm font-normal leading-5 text-brand-gray-200'
        onSelect={handlePrint}
        disabled={isDisabled}
      >
        PDF
      </DropdownMenuItem>

      <div style={{ display: 'none' }}>
        <div
          ref={componentRef}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </>
  );
};

type Props = {
  data?: unknown[];
  className?: string;
};

export function ExportTrigger({ data, className }: Props) {
  const flattenedData = useMemo(() => {
    if (!data) return [];

    return data.map((d) => flattenObject(d as Record<string, unknown>));
  }, [data]);

  const excelExportHandler = useCallback(async () => {
    if (!data || !flattenedData.length) return;

    try {
      const { convertArrayToTable } = arrayToExcel;
      await convertArrayToTable(flattenedData, Date.now().toString());
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }, [data, flattenedData]);

  const pdfContent = useMemo(() => {
    if (!data || !data.length) return '';

    try {
      return arrayToPDF(flattenedData);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      return '';
    }
  }, [data, flattenedData]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            'py-3 px-4 w-[155px] rounded-[12px] bg-[#2F2B430D]',
            'hover:bg-[#2F2B430D] text-base leading-[24px] font-[500] h-[48px]',
            className
          )}
        >
          <ExportIcon />
          <span className=' mr-2'>Export </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <PrintPdfButton htmlContent={pdfContent} isDisabled={!data} />
        <DropdownMenuItem
          className='text-sm font-normal leading-5 text-brand-gray-200'
          onSelect={excelExportHandler}
          disabled={!data}
        >
          Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
