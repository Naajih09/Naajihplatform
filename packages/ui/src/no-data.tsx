import { RotateCw } from 'lucide-react';
import { If, Then } from 'react-if';

import { Button, cn, NoDataIcon } from '.';

type Props = {
  className?: string;
  hideIcon?: boolean;
  label?: string;
  description?: string;
  buttonLabel?: string;
  isLoading?: boolean;

  retryHandler?(): void;
};

export function NoData({
  className,
  retryHandler,
  label,
  description,
  buttonLabel,
  isLoading,
  hideIcon,
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
            <NoDataIcon />
          </Then>
        </If>
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-lg text-center">
            {label ?? 'Nothing To See Here'}
          </h1>
          <p className="text-center font-xs text-brand-gray-300">
            {description}
          </p>
          <If condition={!!retryHandler}>
            <Then>
              <Button
                size="lg"
                className="w-[150px]"
                onClick={retryHandler}
                disabled={isLoading}
              >
                {isLoading && (
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                )}
                {buttonLabel ?? 'Reload'}
              </Button>
            </Then>
          </If>
        </div>
      </div>
    </div>
  );
}
