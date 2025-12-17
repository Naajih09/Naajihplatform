import { RotateCw } from 'lucide-react';
import { If, Then } from 'react-if';

import { Button, ButtonProps, cn, ErrorIcon } from '.';

type Props = {
  className?: string;
  retryHandler?(): void;
  label?: string;
  isLoading?: boolean;
  subActionHandler?(): void;
  subActionBtnLabel?: string;
  buttonLabel?: string;
  maxImgH?: string;
  hideIcon?: boolean;
  btnBrops?: ButtonProps;
};
export function ErrorPlaceholder({
  className,
  hideIcon,
  maxImgH,
  label,
  retryHandler,
  subActionBtnLabel,
  subActionHandler,
  btnBrops,
  isLoading,
  buttonLabel,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={cn(
        'flex justify-center items-center mt-20 min-h-60 text-[#475467] text-[16px]',
        className
      )}
    >
      <div className="flex flex-col w-full h-full justify-center items-center gap-4">
        <If condition={!hideIcon}>
          <Then>
            <ErrorIcon height={maxImgH ?? 130} />
          </Then>
        </If>

        <h1 className="font-bold text-lg text-center">
          {label ?? 'An unexpected error occurred'}
        </h1>

        <If condition={!!retryHandler}>
          <Then>
            <Button
              size="lg"
              className="w-[150px]"
              {...btnBrops}
              onClick={retryHandler}
              disabled={isLoading}
            >
              {isLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
              {buttonLabel ?? 'Retry'}
            </Button>
          </Then>
        </If>

        <If condition={!!subActionHandler}>
          <Then>
            <Button
              variant="ghost"
              className="w-[150px]"
              size="lg"
              {...btnBrops}
              onClick={subActionHandler}
            >
              {subActionBtnLabel}
            </Button>
          </Then>
        </If>
      </div>
    </div>
  );
}
