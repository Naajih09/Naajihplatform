'use client';

import { ReactNode, useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';
import { Button } from './button';

type Props = {
  isOpen: boolean;
  onOpenChange(): void;
  onConfirm?(): void;
  isLoading?: boolean;
  isSuccess?: boolean;
  proceedLabel?: string;
  cancelLabel?: string;
  title?: ReactNode;
  description?: ReactNode;
};

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  cancelLabel,
  description,
  isLoading,
  isSuccess,
  onConfirm,
  proceedLabel,
  title,
}: Props) {
  useEffect(() => {
    if (isSuccess && !isLoading) {
      onOpenChange();
    }
  }, [isLoading, isSuccess, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[519px] px-8">
        <div className="w-full flex flex-col justify-start items-start gap-8">
          <div className="w-full flex flex-col justify-start items-start gap-4">
            <h1 className="text-[28px] font-bold text-[#18181B]">{title}</h1>
            <p className="text-brand-900 text-base ">{description}</p>
          </div>

          <div className="w-full flex gap-4">
            <Button
              className="w-full"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {proceedLabel || 'Yes, Confirm'}
            </Button>

            <Button
              className="w-full text-[#9EA0A5] text-base font-[500]"
              variant="ghost"
              onClick={onOpenChange}
              isDisabled={isLoading}
            >
              {cancelLabel || 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
