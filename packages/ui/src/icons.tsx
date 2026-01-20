import React, { FC } from 'react';
import { SVGProps } from 'react';

type Props = {
  width?: number | string;
  height?: number | string;
} & SVGProps<SVGSVGElement>;
export const DoubbleArrow = (props: Props) => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='w-5 h-5 m-auto'
    {...props}
  >
    <path
      d='M13 19L7 12L13 5'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      opacity={0.5}
      d='M16.9998 19L10.9998 12L16.9998 5'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const DashboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className='group-hover:!text-primary shrink-0'
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      opacity={0.5}
      d='M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z'
      fill='currentColor'
    />
    <path
      d='M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z'
      fill='currentColor'
    />
  </svg>
);

export const ArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M9 5L15 12L9 19'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const DashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M9 5L15 12L9 19'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className='group-hover:!text-primary shrink-0'
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797ZM13.1928 14.5171C13.7783 14.5171 14.253 14.0424 14.253 13.4568C14.253 12.8713 13.7783 12.3966 13.1928 12.3966C12.6072 12.3966 12.1325 12.8713 12.1325 13.4568C12.1325 14.0424 12.6072 14.5171 13.1928 14.5171ZM10.5422 13.4568C10.5422 14.0424 10.0675 14.5171 9.48193 14.5171C8.89637 14.5171 8.42169 14.0424 8.42169 13.4568C8.42169 12.8713 8.89637 12.3966 9.48193 12.3966C10.0675 12.3966 10.5422 12.8713 10.5422 13.4568ZM5.77108 14.5171C6.35664 14.5171 6.83133 14.0424 6.83133 13.4568C6.83133 12.8713 6.35664 12.3966 5.77108 12.3966C5.18553 12.3966 4.71084 12.8713 4.71084 13.4568C4.71084 14.0424 5.18553 14.5171 5.77108 14.5171Z'
      fill='currentColor'
    />
    <path
      opacity={0.5}
      d='M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z'
      fill='currentColor'
    />
  </svg>
);

interface IconInfoCircleProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconInfoCircle: React.FC<IconInfoCircleProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <circle
            opacity={duotone ? '0.5' : '1'}
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            d='M12 7V13'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <circle cx='12' cy='16' r='1' fill='currentColor' />
        </svg>
      ) : (
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10Z'
            fill='currentColor'
          />
          <path
            d='M10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V11C10.75 11.4142 10.4142 11.75 10 11.75C9.58579 11.75 9.25 11.4142 9.25 11V5C9.25 4.58579 9.58579 4.25 10 4.25Z'
            fill='currentColor'
          />
          <path
            d='M10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

interface IconCircleCheckProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconCircleCheck: React.FC<IconCircleCheckProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <circle
            opacity={duotone ? '0.5' : '1'}
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            d='M8.5 12.5L10.5 14.5L15.5 9.5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
            fill='currentColor'
          />
          <path
            d='M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z'
            fill={duotone ? 'currentColor' : 'white'}
          />
        </svg>
      )}
    </>
  );
};

interface IconEyeProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconEye: React.FC<IconEyeProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z'
            stroke='currentColor'
            strokeWidth='1.5'
          ></path>
          <path
            d='M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z'
            stroke='currentColor'
            strokeWidth='1.5'
          ></path>
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M2 12C2 13.6394 2.42496 14.1915 3.27489 15.2957C4.97196 17.5004 7.81811 20 12 20C16.1819 20 19.028 17.5004 20.7251 15.2957C21.575 14.1915 22 13.6394 22 12C22 10.3606 21.575 9.80853 20.7251 8.70433C19.028 6.49956 16.1819 4 12 4C7.81811 4 4.97196 6.49956 3.27489 8.70433C2.42496 9.80853 2 10.3606 2 12Z'
            fill='currentColor'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

interface IconHorizontalDotsProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconHorizontalDots: React.FC<IconHorizontalDotsProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <circle
            cx='5'
            cy='12'
            r='2'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <circle
            opacity={duotone ? '0.5' : '1'}
            cx='12'
            cy='12'
            r='2'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <circle
            cx='19'
            cy='12'
            r='2'
            stroke='currentColor'
            strokeWidth='1.5'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            d='M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z'
            fill='currentColor'
          />
          <path
            d='M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z'
            fill='currentColor'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

interface IconArrowLeftProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconArrowLeft: React.FC<IconArrowLeftProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            d='M4 12H20M20 12L14 6M20 12L14 18'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            fillRule='evenodd'
            clipRule='evenodd'
            d='M3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H13.25V12.75H4C3.58579 12.75 3.25 12.4142 3.25 12Z'
            fill='currentColor'
          />
          <path
            d='M13.25 12.75V18C13.25 18.3034 13.4327 18.5768 13.713 18.6929C13.9932 18.809 14.3158 18.7449 14.5303 18.5304L20.5303 12.5304C20.671 12.3897 20.75 12.1989 20.75 12C20.75 11.8011 20.671 11.6103 20.5303 11.4697L14.5303 5.46969C14.3158 5.25519 13.9932 5.19103 13.713 5.30711C13.4327 5.4232 13.25 5.69668 13.25 6.00002V11.25V12.75Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

interface IconXProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconX: FC<IconXProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <line x1='18' y1='6' x2='6' y2='18'></line>
      <line x1='6' y1='6' x2='18' y2='18'></line>
    </svg>
  );
};

interface IconTwitterProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconTwitter: FC<IconTwitterProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {fill ? (
        <svg
          width='14'
          height='12'
          viewBox='0 0 14 12'
          fill='none'
          className={className}
        >
          <path
            d='M14 1.625C13.475 1.8875 12.95 1.975 12.3375 2.0625C12.95 1.7125 13.3875 1.1875 13.5625 0.4875C13.0375 0.8375 12.425 1.0125 11.725 1.1875C11.2 0.6625 10.4125 0.3125 9.625 0.3125C7.7875 0.3125 6.3875 2.0625 6.825 3.8125C4.4625 3.725 2.3625 2.5875 0.875 0.8375C0.0875 2.15 0.525 3.8125 1.75 4.6875C1.3125 4.6875 0.875 4.5125 0.4375 4.3375C0.4375 5.65 1.4 6.875 2.7125 7.225C2.275 7.3125 1.8375 7.4 1.4 7.3125C1.75 8.45 2.8 9.325 4.1125 9.325C3.0625 10.1125 1.4875 10.55 0 10.375C1.3125 11.1625 2.8 11.6875 4.375 11.6875C9.7125 11.6875 12.6875 7.225 12.5125 3.1125C13.125 2.7625 13.65 2.2375 14 1.625Z'
            fill='currentColor'
          />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={className}
        >
          <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'></path>
        </svg>
      )}
    </>
  );
};

interface IconLinkedinProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconLinkedin: FC<IconLinkedinProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill={fill ? 'currentColor' : 'none'}
      stroke={!fill ? 'currentColor' : 'none'}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
      <rect x='2' y='9' width='4' height='12'></rect>
      <circle cx='4' cy='4' r='2'></circle>
    </svg>
  );
};

interface IconInstagramProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconInstagram: FC<IconInstagramProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          className={className}
        >
          <path
            d='M8 2.05C9.925 2.05 10.1875 2.05 10.975 2.05C11.675 2.05 12.025 2.225 12.2875 2.3125C12.6375 2.4875 12.9 2.575 13.1625 2.8375C13.425 3.1 13.6 3.3625 13.6875 3.7125C13.775 3.975 13.8625 4.325 13.95 5.025C13.95 5.8125 13.95 5.9875 13.95 8C13.95 10.0125 13.95 10.1875 13.95 10.975C13.95 11.675 13.775 12.025 13.6875 12.2875C13.5125 12.6375 13.425 12.9 13.1625 13.1625C12.9 13.425 12.6375 13.6 12.2875 13.6875C12.025 13.775 11.675 13.8625 10.975 13.95C10.1875 13.95 10.0125 13.95 8 13.95C5.9875 13.95 5.8125 13.95 5.025 13.95C4.325 13.95 3.975 13.775 3.7125 13.6875C3.3625 13.5125 3.1 13.425 2.8375 13.1625C2.575 12.9 2.4 12.6375 2.3125 12.2875C2.225 12.025 2.1375 11.675 2.05 10.975C2.05 10.1875 2.05 10.0125 2.05 8C2.05 5.9875 2.05 5.8125 2.05 5.025C2.05 4.325 2.225 3.975 2.3125 3.7125C2.4875 3.3625 2.575 3.1 2.8375 2.8375C3.1 2.575 3.3625 2.4 3.7125 2.3125C3.975 2.225 4.325 2.1375 5.025 2.05C5.8125 2.05 6.075 2.05 8 2.05ZM8 0.737503C5.9875 0.737503 5.8125 0.737503 5.025 0.737503C4.2375 0.737503 3.7125 0.912504 3.275 1.0875C2.8375 1.2625 2.4 1.525 1.9625 1.9625C1.525 2.4 1.35 2.75 1.0875 3.275C0.912504 3.7125 0.825003 4.2375 0.737503 5.025C0.737503 5.8125 0.737503 6.075 0.737503 8C0.737503 10.0125 0.737503 10.1875 0.737503 10.975C0.737503 11.7625 0.912504 12.2875 1.0875 12.725C1.2625 13.1625 1.525 13.6 1.9625 14.0375C2.4 14.475 2.75 14.65 3.275 14.9125C3.7125 15.0875 4.2375 15.175 5.025 15.2625C5.8125 15.2625 6.075 15.2625 8 15.2625C9.925 15.2625 10.1875 15.2625 10.975 15.2625C11.7625 15.2625 12.2875 15.0875 12.725 14.9125C13.1625 14.7375 13.6 14.475 14.0375 14.0375C14.475 13.6 14.65 13.25 14.9125 12.725C15.0875 12.2875 15.175 11.7625 15.2625 10.975C15.2625 10.1875 15.2625 9.925 15.2625 8C15.2625 6.075 15.2625 5.8125 15.2625 5.025C15.2625 4.2375 15.0875 3.7125 14.9125 3.275C14.7375 2.8375 14.475 2.4 14.0375 1.9625C13.6 1.525 13.25 1.35 12.725 1.0875C12.2875 0.912504 11.7625 0.825003 10.975 0.737503C10.1875 0.737503 10.0125 0.737503 8 0.737503Z'
            fill='currentColor'
          />
          <path
            d='M8 4.2375C5.9 4.2375 4.2375 5.9 4.2375 8C4.2375 10.1 5.9 11.7625 8 11.7625C10.1 11.7625 11.7625 10.1 11.7625 8C11.7625 5.9 10.1 4.2375 8 4.2375ZM8 10.45C6.6875 10.45 5.55 9.4 5.55 8C5.55 6.6875 6.6 5.55 8 5.55C9.3125 5.55 10.45 6.6 10.45 8C10.45 9.3125 9.3125 10.45 8 10.45Z'
            fill='currentColor'
          />
          <path
            d='M11.85 5.025C12.3333 5.025 12.725 4.63325 12.725 4.15C12.725 3.66675 12.3333 3.275 11.85 3.275C11.3668 3.275 10.975 3.66675 10.975 4.15C10.975 4.63325 11.3668 5.025 11.85 5.025Z'
            fill='currentColor'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z'
            fill='currentColor'
          />
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M12 7.25C9.37665 7.25 7.25 9.37665 7.25 12C7.25 14.6234 9.37665 16.75 12 16.75C14.6234 16.75 16.75 14.6234 16.75 12C16.75 9.37665 14.6234 7.25 12 7.25ZM12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

interface IconFacebookProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconFacebook: FC<IconFacebookProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill={fill ? 'currentColor' : 'none'}
      stroke={!fill ? 'currentColor' : 'none'}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
    </svg>
  );
};

interface IconProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

export const IconUser: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <circle
            cx='12'
            cy='6'
            r='4'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
        </svg>
      ) : (
        <svg
          width='18'
          height='18'
          viewBox='0 0 18 18'
          fill='none'
          className={className}
        >
          <circle cx='9' cy='4.5' r='3' fill='currentColor' />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M15 13.125C15 14.989 15 16.5 9 16.5C3 16.5 3 14.989 3 13.125C3 11.261 5.68629 9.75 9 9.75C12.3137 9.75 15 11.261 15 13.125Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const IconSearch: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <circle
        cx='11.5'
        cy='11.5'
        r='9.5'
        stroke='currentColor'
        strokeWidth='1.5'
        opacity={duotone ? '0.5' : '1'}
      />
      <path
        d='M18.5 18.5L22 22'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};

export const IconLayoutGrid: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M2.5 6.5C2.5 4.61438 2.5 3.67157 3.08579 3.08579C3.67157 2.5 4.61438 2.5 6.5 2.5C8.38562 2.5 9.32843 2.5 9.91421 3.08579C10.5 3.67157 10.5 4.61438 10.5 6.5C10.5 8.38562 10.5 9.32843 9.91421 9.91421C9.32843 10.5 8.38562 10.5 6.5 10.5C4.61438 10.5 3.67157 10.5 3.08579 9.91421C2.5 9.32843 2.5 8.38562 2.5 6.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M13.5 17.5C13.5 15.6144 13.5 14.6716 14.0858 14.0858C14.6716 13.5 15.6144 13.5 17.5 13.5C19.3856 13.5 20.3284 13.5 20.9142 14.0858C21.5 14.6716 21.5 15.6144 21.5 17.5C21.5 19.3856 21.5 20.3284 20.9142 20.9142C20.3284 21.5 19.3856 21.5 17.5 21.5C15.6144 21.5 14.6716 21.5 14.0858 20.9142C13.5 20.3284 13.5 19.3856 13.5 17.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            d='M2.5 17.5C2.5 15.6144 2.5 14.6716 3.08579 14.0858C3.67157 13.5 4.61438 13.5 6.5 13.5C8.38562 13.5 9.32843 13.5 9.91421 14.0858C10.5 14.6716 10.5 15.6144 10.5 17.5C10.5 19.3856 10.5 20.3284 9.91421 20.9142C9.32843 21.5 8.38562 21.5 6.5 21.5C4.61438 21.5 3.67157 21.5 3.08579 20.9142C2.5 20.3284 2.5 19.3856 2.5 17.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            d='M13.5 6.5C13.5 4.61438 13.5 3.67157 14.0858 3.08579C14.6716 2.5 15.6144 2.5 17.5 2.5C19.3856 2.5 20.3284 2.5 20.9142 3.08579C21.5 3.67157 21.5 4.61438 21.5 6.5C21.5 8.38562 21.5 9.32843 20.9142 9.91421C20.3284 10.5 19.3856 10.5 17.5 10.5C15.6144 10.5 14.6716 10.5 14.0858 9.91421C13.5 9.32843 13.5 8.38562 13.5 6.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M2 6.5C2 4.37868 2 3.31802 2.65901 2.65901C3.31802 2 4.37868 2 6.5 2C8.62132 2 9.68198 2 10.341 2.65901C11 3.31802 11 4.37868 11 6.5C11 8.62132 11 9.68198 10.341 10.341C9.68198 11 8.62132 11 6.5 11C4.37868 11 3.31802 11 2.65901 10.341C2 9.68198 2 8.62132 2 6.5Z'
            fill='currentColor'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M13 17.5C13 15.3787 13 14.318 13.659 13.659C14.318 13 15.3787 13 17.5 13C19.6213 13 20.682 13 21.341 13.659C22 14.318 22 15.3787 22 17.5C22 19.6213 22 20.682 21.341 21.341C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.341C13 20.682 13 19.6213 13 17.5Z'
            fill='currentColor'
          />
          <path
            d='M2 17.5C2 15.3787 2 14.318 2.65901 13.659C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 13.659C11 14.318 11 15.3787 11 17.5C11 19.6213 11 20.682 10.341 21.341C9.68198 22 8.62132 22 6.5 22C4.37868 22 3.31802 22 2.65901 21.341C2 20.682 2 19.6213 2 17.5Z'
            fill='currentColor'
          />
          <path
            d='M13 6.5C13 4.37868 13 3.31802 13.659 2.65901C14.318 2 15.3787 2 17.5 2C19.6213 2 20.682 2 21.341 2.65901C22 3.31802 22 4.37868 22 6.5C22 8.62132 22 9.68198 21.341 10.341C20.682 11 19.6213 11 17.5 11C15.3787 11 14.318 11 13.659 10.341C13 9.68198 13 8.62132 13 6.5Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const IconListCheck: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M2 5.5L3.21429 7L7.5 3'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M2 12.5L3.21429 14L7.5 10'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2 19.5L3.21429 21L7.5 17'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M22 19L12 19'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M22 12L12 12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M22 5L12 5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};

export const IconUserPlus: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <circle cx='10' cy='6' r='4' stroke='currentColor' strokeWidth='1.5' />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        d='M21 10H19M19 10H17M19 10L19 8M19 10L19 12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};

export const IconEdit: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            d='M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9'
            stroke='currentColor'
            strokeWidth='1.5'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M1 12C1 6.81455 1 4.22183 2.61091 2.61091C4.22183 1 6.81455 1 12 1C17.1854 1 19.7782 1 21.3891 2.61091C23 4.22183 23 6.81455 23 12C23 17.1854 23 19.7782 21.3891 21.3891C19.7782 23 17.1854 23 12 23C6.81455 23 4.22183 23 2.61091 21.3891C1 19.7782 1 17.1854 1 12Z'
            fill='currentColor'
          />
          <path
            d='M13.9261 14.3018C14.1711 14.1107 14.3933 13.8885 14.8377 13.4441L20.378 7.90374C20.512 7.7698 20.4507 7.53909 20.2717 7.477C19.6178 7.25011 18.767 6.82414 17.9713 6.02835C17.1755 5.23257 16.7495 4.38186 16.5226 3.72788C16.4605 3.54892 16.2298 3.48761 16.0959 3.62156L10.5555 9.16192C10.1111 9.60634 9.88888 9.82854 9.69778 10.0736C9.47235 10.3626 9.27908 10.6753 9.12139 11.0062C8.98771 11.2867 8.88834 11.5848 8.68959 12.181L8.43278 12.9515L8.02443 14.1765L7.64153 15.3252C7.54373 15.6186 7.6201 15.9421 7.8388 16.1608C8.0575 16.3795 8.38099 16.4559 8.67441 16.3581L9.82308 15.9752L11.0481 15.5668L11.8186 15.31L11.8186 15.31C12.4148 15.1113 12.7129 15.0119 12.9934 14.8782C13.3243 14.7205 13.637 14.5273 13.9261 14.3018Z'
            fill='currentColor'
          />
          <path
            d='M22.1127 6.16905C23.2952 4.98656 23.2952 3.06936 22.1127 1.88687C20.9302 0.704377 19.013 0.704377 17.8306 1.88687L17.6524 2.06499C17.4806 2.23687 17.4027 2.47695 17.4456 2.7162C17.4726 2.8667 17.5227 3.08674 17.6138 3.3493C17.796 3.87439 18.14 4.56368 18.788 5.21165C19.4359 5.85961 20.1252 6.20364 20.6503 6.38581C20.9129 6.4769 21.1329 6.52697 21.2834 6.55399C21.5227 6.59693 21.7627 6.51905 21.9346 6.34717L22.1127 6.16905Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const IconPlus: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.5'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <line x1='12' y1='5' x2='12' y2='19'></line>
      <line x1='5' y1='12' x2='19' y2='12'></line>
    </svg>
  );
};

export const IconTrashLines: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M20.5001 6H3.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      ></path>
      <path
        d='M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      ></path>
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M9.5 11L10 16'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      ></path>
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M14.5 11L14 16'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      ></path>
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6'
        stroke='currentColor'
        strokeWidth='1.5'
      ></path>
    </svg>
  );
};

export const IconDownload: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            d='M12 2L12 15M12 15L9 11.5M12 15L15 11.5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ) : duotone ? (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M22 16.0003V15.0003C22 12.1718 21.9998 10.7581 21.1211 9.8794C20.2424 9.00072 18.8282 9.00072 15.9998 9.00072H7.99977C5.17135 9.00072 3.75713 9.00072 2.87845 9.8794C2 10.7579 2 12.1711 2 14.9981V15.0003V16.0003C2 18.8287 2 20.2429 2.87868 21.1216C3.75736 22.0003 5.17157 22.0003 8 22.0003H16H16C18.8284 22.0003 20.2426 22.0003 21.1213 21.1216C22 20.2429 22 18.8287 22 16.0003Z'
            fill='currentColor'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 1.25C11.5858 1.25 11.25 1.58579 11.25 2L11.25 12.9726L9.56943 11.0119C9.29986 10.6974 8.82639 10.661 8.51189 10.9306C8.1974 11.2001 8.16098 11.6736 8.43054 11.9881L11.4305 15.4881C11.573 15.6543 11.781 15.75 12 15.75C12.2189 15.75 12.4269 15.6543 12.5694 15.4881L15.5694 11.9881C15.839 11.6736 15.8026 11.2001 15.4881 10.9306C15.1736 10.661 14.7001 10.6974 14.4305 11.0119L12.75 12.9726L12.75 2C12.75 1.58579 12.4142 1.25 12 1.25Z'
            fill='currentColor'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M12 1.25C11.5858 1.25 11.25 1.58579 11.25 2V12.9726L9.56944 11.0119C9.29988 10.6974 8.8264 10.661 8.51191 10.9306C8.19741 11.2001 8.16099 11.6736 8.43056 11.9881L11.4306 15.4881C11.573 15.6543 11.7811 15.75 12 15.75C12.2189 15.75 12.427 15.6543 12.5694 15.4881L15.5694 11.9881C15.839 11.6736 15.8026 11.2001 15.4881 10.9306C15.1736 10.661 14.7001 10.6974 14.4306 11.0119L12.75 12.9726L12.75 2C12.75 1.58579 12.4142 1.25 12 1.25Z'
            fill='currentColor'
          />
          <path
            d='M14.25 9V9.37828C14.9836 9.11973 15.8312 9.2491 16.4642 9.79167C17.4077 10.6004 17.517 12.0208 16.7083 12.9643L13.7083 16.4643C13.2808 16.963 12.6568 17.25 12 17.25C11.3431 17.25 10.7191 16.963 10.2916 16.4643L7.29163 12.9643C6.48293 12.0208 6.5922 10.6004 7.53568 9.79167C8.16868 9.2491 9.01637 9.11973 9.74996 9.37828V9H8C5.17157 9 3.75736 9 2.87868 9.87868C2 10.7574 2 12.1716 2 15V16C2 18.8284 2 20.2426 2.87868 21.1213C3.75736 22 5.17157 22 7.99999 22H16C18.8284 22 20.2426 22 21.1213 21.1213C22 20.2426 22 18.8284 22 16V15C22 12.1716 22 10.7574 21.1213 9.87868C20.2426 9 18.8284 9 16 9H14.25Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const IconSend: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M17.4975 18.4851L20.6281 9.09373C21.8764 5.34874 22.5006 3.47624 21.5122 2.48782C20.5237 1.49939 18.6511 2.12356 14.906 3.37189L5.57477 6.48218C3.49295 7.1761 2.45203 7.52305 2.13608 8.28637C2.06182 8.46577 2.01692 8.65596 2.00311 8.84963C1.94433 9.67365 2.72018 10.4495 4.27188 12.0011L4.55451 12.2837C4.80921 12.5384 4.93655 12.6658 5.03282 12.8075C5.22269 13.0871 5.33046 13.4143 5.34393 13.7519C5.35076 13.9232 5.32403 14.1013 5.27057 14.4574C5.07488 15.7612 4.97703 16.4131 5.0923 16.9147C5.32205 17.9146 6.09599 18.6995 7.09257 18.9433C7.59255 19.0656 8.24576 18.977 9.5522 18.7997L9.62363 18.79C9.99191 18.74 10.1761 18.715 10.3529 18.7257C10.6738 18.745 10.9838 18.8496 11.251 19.0285C11.3981 19.1271 11.5295 19.2585 11.7923 19.5213L12.0436 19.7725C13.5539 21.2828 14.309 22.0379 15.1101 21.9985C15.3309 21.9877 15.5479 21.9365 15.7503 21.8474C16.4844 21.5244 16.8221 20.5113 17.4975 18.4851Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M6 18L21 3'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};

export const IconSave: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        d='M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M7 8H13'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};

export const IconPrinter: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M6 17.9827C4.44655 17.9359 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9359 18 17.9827'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M9 10H6'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M19 14L5 14'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M18 14V16C18 18.8284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V14'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M17.9827 6C17.9359 4.44655 17.7626 3.51998 17.1213 2.87868C16.2427 2 14.8284 2 12 2C9.17158 2 7.75737 2 6.87869 2.87868C6.23739 3.51998 6.06414 4.44655 6.01733 6'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <circle
        opacity={duotone ? '0.5' : '1'}
        cx='17'
        cy='10'
        r='1'
        fill='currentColor'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M15 16.5H9'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M13 19H9'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};

export const IconGoogle: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.8512 7.15912C13.8512 6.66275 13.8066 6.18548 13.7239 5.72729H7.13116V8.43503H10.8984C10.7362 9.31003 10.243 10.0514 9.50162 10.5478V12.3041H11.7639C13.0875 11.0855 13.8512 9.29094 13.8512 7.15912Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.13089 14C9.0209 14 10.6054 13.3731 11.7636 12.3041L9.50135 10.5477C8.87454 10.9677 8.07272 11.2159 7.13089 11.2159C5.30771 11.2159 3.76452 9.9845 3.21407 8.32996H0.875427V10.1436C2.02725 12.4313 4.39453 14 7.13089 14Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.21435 8.32997C3.07435 7.90997 2.99481 7.46133 2.99481 6.99997C2.99481 6.5386 3.07435 6.08996 3.21435 5.66996V3.85632H0.875712C0.40162 4.80133 0.131165 5.87042 0.131165 6.99997C0.131165 8.12951 0.40162 9.19861 0.875712 10.1436L3.21435 8.32997Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.13089 2.7841C8.15862 2.7841 9.08135 3.13728 9.80681 3.83092L11.8145 1.82319C10.6023 0.693638 9.01772 0 7.13089 0C4.39453 0 2.02725 1.56864 0.875427 3.85637L3.21407 5.67001C3.76452 4.01546 5.30771 2.7841 7.13089 2.7841Z'
        fill='currentColor'
      />
    </svg>
  );
};

export const IconMail: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            d='M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      ) : (
        <svg
          width='18'
          height='18'
          viewBox='0 0 18 18'
          fill='none'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M10.65 2.25H7.35C4.23873 2.25 2.6831 2.25 1.71655 3.23851C0.75 4.22703 0.75 5.81802 0.75 9C0.75 12.182 0.75 13.773 1.71655 14.7615C2.6831 15.75 4.23873 15.75 7.35 15.75H10.65C13.7613 15.75 15.3169 15.75 16.2835 14.7615C17.25 13.773 17.25 12.182 17.25 9C17.25 5.81802 17.25 4.22703 16.2835 3.23851C15.3169 2.25 13.7613 2.25 10.65 2.25Z'
            fill='currentColor'
          />
          <path
            d='M14.3465 6.02574C14.609 5.80698 14.6445 5.41681 14.4257 5.15429C14.207 4.89177 13.8168 4.8563 13.5543 5.07507L11.7732 6.55931C11.0035 7.20072 10.4691 7.6446 10.018 7.93476C9.58125 8.21564 9.28509 8.30993 9.00041 8.30993C8.71572 8.30993 8.41956 8.21564 7.98284 7.93476C7.53168 7.6446 6.9973 7.20072 6.22761 6.55931L4.44652 5.07507C4.184 4.8563 3.79384 4.89177 3.57507 5.15429C3.3563 5.41681 3.39177 5.80698 3.65429 6.02574L5.4664 7.53583C6.19764 8.14522 6.79033 8.63914 7.31343 8.97558C7.85834 9.32604 8.38902 9.54743 9.00041 9.54743C9.6118 9.54743 10.1425 9.32604 10.6874 8.97558C11.2105 8.63914 11.8032 8.14522 12.5344 7.53582L14.3465 6.02574Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const IconLockDots: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            d='M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <g opacity={duotone ? '0.5' : '1'}>
            <path
              d='M9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16Z'
              fill='currentColor'
            />
            <path
              d='M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z'
              fill='currentColor'
            />
            <path
              d='M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z'
              fill='currentColor'
            />
          </g>
        </svg>
      ) : (
        <svg
          width='18'
          height='18'
          viewBox='0 0 18 18'
          fill='none'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M1.5 12C1.5 9.87868 1.5 8.81802 2.15901 8.15901C2.81802 7.5 3.87868 7.5 6 7.5H12C14.1213 7.5 15.182 7.5 15.841 8.15901C16.5 8.81802 16.5 9.87868 16.5 12C16.5 14.1213 16.5 15.182 15.841 15.841C15.182 16.5 14.1213 16.5 12 16.5H6C3.87868 16.5 2.81802 16.5 2.15901 15.841C1.5 15.182 1.5 14.1213 1.5 12Z'
            fill='currentColor'
          />
          <path
            d='M6 12.75C6.41421 12.75 6.75 12.4142 6.75 12C6.75 11.5858 6.41421 11.25 6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75Z'
            fill='currentColor'
          />
          <path
            d='M9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z'
            fill='currentColor'
          />
          <path
            d='M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z'
            fill='currentColor'
          />
          <path
            d='M5.0625 6C5.0625 3.82538 6.82538 2.0625 9 2.0625C11.1746 2.0625 12.9375 3.82538 12.9375 6V7.50268C13.363 7.50665 13.7351 7.51651 14.0625 7.54096V6C14.0625 3.20406 11.7959 0.9375 9 0.9375C6.20406 0.9375 3.9375 3.20406 3.9375 6V7.54096C4.26488 7.51651 4.63698 7.50665 5.0625 7.50268V6Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const IconCaretDown: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            d='M19 9L12 15L5 9'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ) : (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            d='M12.4044 8.30273L15.8351 11.6296C16.0549 11.8428 16.0549 12.1573 15.8351 12.3704L9.20467 18.8001C8.79094 19.2013 8 18.9581 8 18.4297V12.7071L12.4044 8.30273Z'
            fill='currentColor'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M8 11.2929L8 5.5703C8 5.04189 8.79094 4.79869 9.20467 5.1999L11.6864 7.60648L8 11.2929Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const LogoWithText = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={130}
    height={20}
    viewBox='0 0 130 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <g clipPath='url(#clip0_4836_27943)'>
      <path
        d='M33.884 2.62402C36.7228 2.62402 38.8645 3.48496 40.3092 5.20879L37.3692 7.88201C37.1298 7.49675 36.7665 7.15474 36.2808 6.85793C35.7794 6.62009 35.1418 6.50216 34.3644 6.50216C32.8987 6.50216 31.751 7.31985 30.923 8.95326C30.6906 9.53311 30.5753 10.111 30.5753 10.6909C30.5753 12.6289 31.4173 13.995 33.1014 14.7891C33.58 14.968 34.0308 15.0565 34.4518 15.0565H34.9304C36.3821 14.9149 37.1089 14.6339 37.1089 14.2093V12.6938H34.1041V9.44073H41.5094V18.5297H38.2426V18.0402C37.5666 18.3665 36.5219 18.6201 35.1069 18.797C34.7365 18.856 34.3452 18.9012 33.9312 18.9307C32.0148 18.9307 30.3587 18.3213 28.9664 17.1046C28.1174 16.2515 27.5077 15.3886 27.1373 14.5198C26.5556 13.3326 26.2656 12.055 26.2656 10.6889C26.2656 8.43827 27.1513 6.37439 28.9227 4.49528C30.3028 3.24712 31.9571 2.62402 33.8875 2.62402H33.884Z'
        fill='#FE5F55'
      />
      <path
        d='M48.6937 6.52346C50.9734 6.52346 52.8165 7.53378 54.2262 9.55246C54.7783 10.5706 55.0543 11.5357 55.0543 12.4478V13.0709C55.0543 14.6827 54.3433 16.1529 52.9195 17.4817C51.6635 18.5215 50.2118 19.0404 48.5644 19.0404C46.2567 19.0404 44.4259 18.0596 43.0755 16.0999C42.4659 15.1131 42.1602 14.0439 42.1602 12.892V12.7131C42.1602 10.4566 43.2345 8.65811 45.3833 7.3215C46.407 6.78685 47.511 6.51953 48.6937 6.51953V6.52346ZM46.821 12.5382V13.1181C46.821 14.4763 47.242 15.2488 48.084 15.4355L48.6937 15.4807C49.4623 15.4807 49.9567 15.1682 50.1751 14.5451C50.3498 14.0104 50.4371 13.4168 50.4371 12.7623C50.4371 10.9795 49.8414 10.0891 48.6518 10.0891H48.5208C47.8167 10.0891 47.3381 10.4154 47.083 11.0699C46.9083 11.5082 46.821 11.9977 46.821 12.5402V12.5382Z'
        fill='#FE5F55'
      />
      <path
        d='M60.7938 11.9366V18.486H56.4387V11.9366H55.3398V8.79556H56.4387C56.4963 6.18917 57.4292 4.43585 59.2373 3.53757C60.254 3.1818 61.2707 3.00293 62.2857 3.00293H64.0501V6.06534C62.4464 6.14789 61.5205 6.36608 61.2724 6.72185C60.9527 7.17394 60.7938 7.65747 60.7938 8.1705V8.79359H63.505V11.9346H60.7938V11.9366Z'
        fill='#FE5F55'
      />
      <path
        d='M64.7773 18.4867V2.8916H69.1325V18.4867H64.7773Z'
        fill='#FE5F55'
      />
      <path
        d='M75.9082 6.74609C78.9636 6.74609 80.9097 8.36575 81.7447 11.6031C81.8897 12.2203 81.9631 12.981 81.9631 13.8871V14.0994H73.9481V14.1446C74.1875 14.7677 74.5368 15.1962 74.9928 15.4262C75.4208 15.6562 75.8278 15.7721 76.2122 15.7721H76.3641C76.8725 15.7721 77.3581 15.4753 77.8228 14.8817H81.743V14.9269C80.2982 17.5255 78.4692 18.8247 76.2541 18.8247C74.1927 18.8247 72.61 18.1997 71.5059 16.9476C70.4018 15.6955 69.8516 14.3314 69.8516 12.8532C69.8516 11.1372 70.4315 9.69843 71.5933 8.53676C72.755 7.37509 74.1927 6.77951 75.9047 6.74806L75.9082 6.74609ZM73.9045 11.4694H77.9119V11.436C77.9119 11.1235 77.6936 10.7854 77.2586 10.4218C76.8585 10.2134 76.4532 10.1092 76.0392 10.1092C74.8565 10.1092 74.1438 10.5613 73.9045 11.4675V11.4694Z'
        fill='#FE5F55'
      />
      <path
        d='M84.2687 12.8056L80.6211 7.125H85.3029L86.6096 9.16333L87.9163 7.125H92.5981L88.9505 12.8056L92.5981 18.4862H87.9163L86.6096 16.4479L85.3029 18.4862H80.6211L84.2687 12.8056Z'
        fill='#FE5F55'
      />
      <path
        d='M22.3852 15.8565V20H8.88666C3.97952 20 0 15.5224 0 9.99902C0 7.23931 0.994007 4.73907 2.60293 2.92875C4.21186 1.11843 6.43397 0 8.88666 0H14.6446C17.6248 0 20.212 1.89287 21.5048 4.67027L15.9146 7.77592C15.2245 6.39803 13.9091 5.46437 12.4015 5.46437C10.1759 5.46437 8.37132 7.49484 8.37132 9.99902C8.37132 12.5032 10.1759 14.5356 12.4015 14.5356C13.8777 14.5356 15.1669 13.6452 15.8692 12.3125L22.3852 15.8565Z'
        fill='#FE5F55'
      />
      <path
        d='M16.4317 9.99946C16.4317 10.8447 16.2273 11.6348 15.8692 12.313L11.7656 10.082L15.9146 7.77637C16.2465 8.43288 16.4334 9.1916 16.4334 9.99946H16.4317Z'
        fill='#FE5F55'
      />
      <path
        d='M96.565 7.19993V8.61713C97.1031 7.49673 98.125 6.93457 99.6326 6.93457C100.852 6.93457 101.79 7.35128 102.445 8.18469C103.1 9.01811 103.429 10.1424 103.429 11.5596V18.795H100.635V11.9134C100.635 10.394 100.052 9.63334 98.8849 9.63334C98.2159 9.63334 97.6988 9.85939 97.3319 10.3075C96.9651 10.7577 96.7816 11.3729 96.7816 12.1552V18.793H93.9883V7.19993H96.565Z'
        fill='#FE5F55'
      />
      <path
        d='M112.986 17.3012C111.99 18.4746 110.685 19.0604 109.073 19.0604C107.46 19.0604 106.155 18.4746 105.159 17.3012C104.164 16.1277 103.664 14.6928 103.664 12.9965C103.664 11.3002 104.162 9.8653 105.159 8.69183C106.155 7.51837 107.46 6.93262 109.073 6.93262C110.685 6.93262 111.99 7.51837 112.986 8.69183C113.981 9.8653 114.481 11.3002 114.481 12.9965C114.481 14.6928 113.983 16.1277 112.986 17.3012ZM107.195 10.5847C106.704 11.1744 106.457 11.9783 106.457 12.9965C106.457 14.0147 106.704 14.8186 107.195 15.4083C107.686 15.998 108.313 16.2928 109.073 16.2928C109.832 16.2928 110.46 15.998 110.951 15.4083C111.441 14.8186 111.688 14.0147 111.688 12.9965C111.688 11.9783 111.441 11.1744 110.951 10.5847C110.46 9.99502 109.832 9.70018 109.073 9.70018C108.313 9.70018 107.686 9.99502 107.195 10.5847Z'
        fill='#FE5F55'
      />
      <path
        d='M123.783 18.7953L121.699 11.6248L121.549 11.5855L119.44 18.7933H116.939L113.34 7.19824H116.231L118.296 14.8326L120.42 7.19824H123.02L125.156 14.8503L127.167 7.19824H129.999L126.4 18.7933H123.785L123.783 18.7953Z'
        fill='#FE5F55'
      />
    </g>
    <defs>
      <clipPath id='clip0_4836_27943'>
        <rect width={130} height={20} fill='white' />
      </clipPath>
    </defs>
  </svg>
);

export const CorporateSender = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={141}
    height={117}
    viewBox='0 0 141 117'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M44.0337 117.527C44.3209 117.527 44.5537 117.295 44.5537 117.007C44.5537 116.72 44.3209 116.487 44.0337 116.487C43.7465 116.487 43.5137 116.72 43.5137 117.007C43.5137 117.295 43.7465 117.527 44.0337 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M47.311 117.527C47.5982 117.527 47.8311 117.295 47.8311 117.007C47.8311 116.72 47.5982 116.487 47.311 116.487C47.0238 116.487 46.791 116.72 46.791 117.007C46.791 117.295 47.0238 117.527 47.311 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M50.5864 117.527C50.8736 117.527 51.1064 117.295 51.1064 117.007C51.1064 116.72 50.8736 116.487 50.5864 116.487C50.2992 116.487 50.0664 116.72 50.0664 117.007C50.0664 117.295 50.2992 117.527 50.5864 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M53.8638 117.527C54.151 117.527 54.3838 117.295 54.3838 117.007C54.3838 116.72 54.151 116.487 53.8638 116.487C53.5766 116.487 53.3438 116.72 53.3438 117.007C53.3438 117.295 53.5766 117.527 53.8638 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M57.1392 117.527C57.4264 117.527 57.6592 117.295 57.6592 117.007C57.6592 116.72 57.4264 116.487 57.1392 116.487C56.852 116.487 56.6191 116.72 56.6191 117.007C56.6191 117.295 56.852 117.527 57.1392 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M60.4165 117.527C60.7037 117.527 60.9365 117.295 60.9365 117.007C60.9365 116.72 60.7037 116.487 60.4165 116.487C60.1293 116.487 59.8965 116.72 59.8965 117.007C59.8965 117.295 60.1293 117.527 60.4165 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M63.6919 117.527C63.9791 117.527 64.2119 117.295 64.2119 117.007C64.2119 116.72 63.9791 116.487 63.6919 116.487C63.4047 116.487 63.1719 116.72 63.1719 117.007C63.1719 117.295 63.4047 117.527 63.6919 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M24.3774 117.527C24.6646 117.527 24.8975 117.295 24.8975 117.007C24.8975 116.72 24.6646 116.487 24.3774 116.487C24.0902 116.487 23.8574 116.72 23.8574 117.007C23.8574 117.295 24.0902 117.527 24.3774 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M27.6529 117.527C27.9401 117.527 28.1729 117.295 28.1729 117.007C28.1729 116.72 27.9401 116.487 27.6529 116.487C27.3657 116.487 27.1328 116.72 27.1328 117.007C27.1328 117.295 27.3657 117.527 27.6529 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M30.9282 117.527C31.2154 117.527 31.4482 117.295 31.4482 117.007C31.4482 116.72 31.2154 116.487 30.9282 116.487C30.641 116.487 30.4082 116.72 30.4082 117.007C30.4082 117.295 30.641 117.527 30.9282 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M34.2056 117.527C34.4928 117.527 34.7256 117.295 34.7256 117.007C34.7256 116.72 34.4928 116.487 34.2056 116.487C33.9184 116.487 33.6855 116.72 33.6855 117.007C33.6855 117.295 33.9184 117.527 34.2056 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M37.4829 117.527C37.7701 117.527 38.0029 117.295 38.0029 117.007C38.0029 116.72 37.7701 116.487 37.4829 116.487C37.1957 116.487 36.9629 116.72 36.9629 117.007C36.9629 117.295 37.1957 117.527 37.4829 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M40.7583 117.527C41.0455 117.527 41.2783 117.295 41.2783 117.007C41.2783 116.72 41.0455 116.487 40.7583 116.487C40.4711 116.487 40.2383 116.72 40.2383 117.007C40.2383 117.295 40.4711 117.527 40.7583 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M93.1763 117.527C93.4635 117.527 93.6963 117.295 93.6963 117.007C93.6963 116.72 93.4635 116.487 93.1763 116.487C92.8891 116.487 92.6562 116.72 92.6562 117.007C92.6562 117.295 92.8891 117.527 93.1763 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M96.4517 117.527C96.7389 117.527 96.9717 117.295 96.9717 117.007C96.9717 116.72 96.7389 116.487 96.4517 116.487C96.1645 116.487 95.9316 116.72 95.9316 117.007C95.9316 117.295 96.1645 117.527 96.4517 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M99.729 117.527C100.016 117.527 100.249 117.295 100.249 117.007C100.249 116.72 100.016 116.487 99.729 116.487C99.4418 116.487 99.209 116.72 99.209 117.007C99.209 117.295 99.4418 117.527 99.729 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M103.004 117.527C103.292 117.527 103.524 117.295 103.524 117.007C103.524 116.72 103.292 116.487 103.004 116.487C102.717 116.487 102.484 116.72 102.484 117.007C102.484 117.295 102.717 117.527 103.004 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M106.282 117.527C106.569 117.527 106.802 117.295 106.802 117.007C106.802 116.72 106.569 116.487 106.282 116.487C105.995 116.487 105.762 116.72 105.762 117.007C105.762 117.295 105.995 117.527 106.282 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M109.557 117.527C109.844 117.527 110.077 117.295 110.077 117.007C110.077 116.72 109.844 116.487 109.557 116.487C109.27 116.487 109.037 116.72 109.037 117.007C109.037 117.295 109.27 117.527 109.557 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M112.834 117.527C113.122 117.527 113.355 117.295 113.355 117.007C113.355 116.72 113.122 116.487 112.834 116.487C112.547 116.487 112.314 116.72 112.314 117.007C112.314 117.295 112.547 117.527 112.834 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M70.2407 117.527C70.5279 117.527 70.7607 117.295 70.7607 117.007C70.7607 116.72 70.5279 116.487 70.2407 116.487C69.9535 116.487 69.7207 116.72 69.7207 117.007C69.7207 117.295 69.9535 117.527 70.2407 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M66.9654 117.527C67.2526 117.527 67.4854 117.295 67.4854 117.007C67.4854 116.72 67.2526 116.487 66.9654 116.487C66.6782 116.487 66.4453 116.72 66.4453 117.007C66.4453 117.295 66.6782 117.527 66.9654 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M73.5181 117.527C73.8053 117.527 74.0381 117.295 74.0381 117.007C74.0381 116.72 73.8053 116.487 73.5181 116.487C73.2309 116.487 72.998 116.72 72.998 117.007C72.998 117.295 73.2309 117.527 73.5181 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M76.7954 117.527C77.0826 117.527 77.3154 117.295 77.3154 117.007C77.3154 116.72 77.0826 116.487 76.7954 116.487C76.5082 116.487 76.2754 116.72 76.2754 117.007C76.2754 117.295 76.5082 117.527 76.7954 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M80.0708 117.527C80.358 117.527 80.5908 117.295 80.5908 117.007C80.5908 116.72 80.358 116.487 80.0708 116.487C79.7836 116.487 79.5508 116.72 79.5508 117.007C79.5508 117.295 79.7836 117.527 80.0708 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M83.3462 117.527C83.6334 117.527 83.8662 117.295 83.8662 117.007C83.8662 116.72 83.6334 116.487 83.3462 116.487C83.059 116.487 82.8262 116.72 82.8262 117.007C82.8262 117.295 83.059 117.527 83.3462 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M86.6235 117.527C86.9107 117.527 87.1436 117.295 87.1436 117.007C87.1436 116.72 86.9107 116.487 86.6235 116.487C86.3363 116.487 86.1035 116.72 86.1035 117.007C86.1035 117.295 86.3363 117.527 86.6235 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M89.8989 117.527C90.1861 117.527 90.4189 117.295 90.4189 117.007C90.4189 116.72 90.1861 116.487 89.8989 116.487C89.6117 116.487 89.3789 116.72 89.3789 117.007C89.3789 117.295 89.6117 117.527 89.8989 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M116.065 117.527C116.352 117.527 116.585 117.295 116.585 117.007C116.585 116.72 116.352 116.487 116.065 116.487C115.778 116.487 115.545 116.72 115.545 117.007C115.545 117.295 115.778 117.527 116.065 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M119.34 117.527C119.628 117.527 119.86 117.295 119.86 117.007C119.86 116.72 119.628 116.487 119.34 116.487C119.053 116.487 118.82 116.72 118.82 117.007C118.82 117.295 119.053 117.527 119.34 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M122.616 117.527C122.903 117.527 123.136 117.295 123.136 117.007C123.136 116.72 122.903 116.487 122.616 116.487C122.328 116.487 122.096 116.72 122.096 117.007C122.096 117.295 122.328 117.527 122.616 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M125.893 117.527C126.18 117.527 126.413 117.295 126.413 117.007C126.413 116.72 126.18 116.487 125.893 116.487C125.606 116.487 125.373 116.72 125.373 117.007C125.373 117.295 125.606 117.527 125.893 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M129.168 117.527C129.456 117.527 129.688 117.295 129.688 117.007C129.688 116.72 129.456 116.487 129.168 116.487C128.881 116.487 128.648 116.72 128.648 117.007C128.648 117.295 128.881 117.527 129.168 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M132.446 117.527C132.733 117.527 132.966 117.295 132.966 117.007C132.966 116.72 132.733 116.487 132.446 116.487C132.159 116.487 131.926 116.72 131.926 117.007C131.926 117.295 132.159 117.527 132.446 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M135.723 117.527C136.01 117.527 136.243 117.295 136.243 117.007C136.243 116.72 136.01 116.487 135.723 116.487C135.436 116.487 135.203 116.72 135.203 117.007C135.203 117.295 135.436 117.527 135.723 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M139.032 117.527C139.319 117.527 139.552 117.295 139.552 117.007C139.552 116.72 139.319 116.487 139.032 116.487C138.745 116.487 138.512 116.72 138.512 117.007C138.512 117.295 138.745 117.527 139.032 117.527Z'
      fill='#E6F5FF'
    />
    <path
      d='M28.2939 16.4618L84.752 -13L141.276 16.4618V115.695H28.293L28.2939 16.4618Z'
      fill='#B0DFFF'
    />
    <path
      d='M104.906 17.5078L136.46 115.799H46.3359L83.8681 17.5078H104.906Z'
      fill='white'
    />
    <path
      d='M94.3105 17.5078V115.799'
      stroke='#B4433C'
      strokeWidth={1.17722}
      strokeMiterlimit={10}
    />
    <path
      d='M104.905 17.5085H83.8672L87.0789 7.8457H101.693L104.905 17.5085Z'
      fill='#FE5F55'
    />
    <path
      d='M87.4141 6.66797H101.359'
      stroke='white'
      strokeWidth={1.17722}
      strokeMiterlimit={10}
      strokeLinecap='round'
    />
    <path
      d='M100.578 17.5078V29.4855'
      stroke='#B4433C'
      strokeWidth={1.17722}
      strokeMiterlimit={10}
    />
    <path
      d='M100.563 31.0277C101.007 31.0277 101.367 30.668 101.367 30.2243C101.367 29.7806 101.007 29.4209 100.563 29.4209C100.119 29.4209 99.7598 29.7806 99.7598 30.2243C99.7598 30.668 100.119 31.0277 100.563 31.0277Z'
      stroke='#FE5F55'
      strokeWidth={1.17722}
      strokeMiterlimit={10}
      strokeLinecap='round'
    />
    <path
      d='M81.2197 90.3345C80.7778 91.1523 80.123 91.8353 79.3246 92.3111C78.5262 92.787 77.614 93.0381 76.6845 93.0377H45.1016V89.0025H50.7932L58.7128 70.9879C59.1281 70.0429 59.8092 69.2392 60.6732 68.6745C61.5373 68.1099 62.5469 67.8087 63.579 67.8076H83.6938C87.6173 67.8076 90.1907 71.9105 88.4856 75.441L81.2197 90.3345Z'
      fill='#6B2824'
    />
    <path
      d='M74.2715 93.0371L82.8953 115.695'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M55.1003 93.0371L46.4766 115.695'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M51.709 63.0133V59.1547C51.709 57.6486 52.0056 56.1574 52.5819 54.766C53.1583 53.3746 54.003 52.1104 55.0679 51.0455C56.1328 49.9806 57.3971 49.1358 58.7885 48.5595C60.1798 47.9832 61.6711 47.6865 63.1771 47.6865H81.0754C83.9941 47.6861 86.8421 48.584 89.2329 50.2583C91.6236 51.9325 93.441 54.302 94.4385 57.045L98.6549 68.6353C100.05 72.471 98.925 76.4194 96.3564 78.9966C93.9146 81.4469 90.2774 82.2722 86.9798 81.2255L81.479 78.7198L79.5497 81.5528L51.709 63.0133Z'
      fill='#FE948D'
    />
    <path
      d='M87.857 49.4099H57.1328C57.3771 49.2572 57.6267 49.1144 57.8818 48.9814H87.0011C87.2654 49.1026 87.5268 49.2324 87.7826 49.3708C87.8083 49.3832 87.8331 49.3965 87.857 49.4099Z'
      fill='#FFCDCA'
    />
    <path
      d='M90.9301 51.6589H54.502C54.6279 51.5139 54.7577 51.3727 54.8913 51.2314H90.4674C90.6238 51.3727 90.7775 51.512 90.9301 51.6589Z'
      fill='#FFCDCA'
    />
    <path
      d='M92.8302 53.9069H52.9766L53.0395 53.7858C53.0949 53.6827 53.1502 53.5806 53.2084 53.4785H92.5201C92.5821 53.5606 92.6422 53.6455 92.7014 53.7304C92.7501 53.7886 92.7901 53.8459 92.8302 53.9069Z'
      fill='#FFCDCA'
    />
    <path
      d='M94.0774 56.155H52.1055C52.1436 56.0109 52.1856 55.8687 52.2305 55.7266H93.8799C93.9486 55.8678 94.0144 56.0106 94.0774 56.155Z'
      fill='#FFCDCA'
    />
    <path
      d='M94.9324 58.4031H51.7363C51.744 58.2599 51.7573 58.1168 51.7707 57.9756H94.7779L94.9324 58.4031Z'
      fill='#FFCDCA'
    />
    <path
      d='M95.7495 60.6511H51.709V60.2227H95.594L95.7495 60.6511Z'
      fill='#FFCDCA'
    />
    <path
      d='M96.5672 62.9001H51.709V62.4717H96.4117L96.5672 62.9001Z'
      fill='#FFCDCA'
    />
    <path
      d='M97.3845 65.1472H54.9107L54.3792 64.7932L54.2676 64.7188H97.2299L97.3845 65.1472Z'
      fill='#FFCDCA'
    />
    <path
      d='M98.2043 67.3962H58.2876L57.6445 66.9688H98.0488L98.2043 67.3962Z'
      fill='#FFCDCA'
    />
    <path
      d='M98.9677 69.6442H61.6646L61.1255 69.2855L61.0215 69.2158H98.8466C98.8895 69.358 98.9286 69.5011 98.9677 69.6442Z'
      fill='#FFCDCA'
    />
    <path
      d='M99.2589 71.8923H65.0406L64.3984 71.4639H99.2427C99.2542 71.6079 99.2542 71.7501 99.2589 71.8923Z'
      fill='#FFCDCA'
    />
    <path
      d='M99.1102 73.7139C99.0854 73.857 99.0568 74.0001 99.0243 74.1413H68.4156L67.8689 73.7778L67.7734 73.7139H99.1102Z'
      fill='#FFCDCA'
    />
    <path
      d='M98.4282 75.9609C98.3646 76.1053 98.2978 76.2481 98.2278 76.3894H71.7974L71.1543 75.9609H98.4282Z'
      fill='#FFCDCA'
    />
    <path
      d='M97.0639 78.209C96.9704 78.3248 96.875 78.4383 96.7777 78.5496L96.7004 78.6374H75.1696L74.7221 78.3387L74.5312 78.209H97.0639Z'
      fill='#FFCDCA'
    />
    <path
      d='M70.2253 47.6885V75.346L69.7969 75.0597V47.6885H70.2253Z'
      fill='#FFCDCA'
    />
    <path
      d='M72.4733 47.6885V76.8421L72.0449 76.5577V47.6885H72.4733Z'
      fill='#FFCDCA'
    />
    <path
      d='M74.7214 47.6885V78.3392L74.5268 78.2094L74.293 78.0539V47.6885H74.7214Z'
      fill='#FFCDCA'
    />
    <path
      d='M76.9694 47.6885V79.8372L76.541 79.551V47.6885H76.9694Z'
      fill='#FFCDCA'
    />
    <path
      d='M79.2185 47.6885V81.3334L78.791 81.049V47.6885H79.2185Z'
      fill='#FFCDCA'
    />
    <path
      d='M81.4675 47.6942V78.74L81.0391 79.3688V47.6904H81.0763H81.2824H81.4427L81.4675 47.6942Z'
      fill='#FFCDCA'
    />
    <path
      d='M83.7136 47.9377V80.1885L83.2852 80.0521V47.8613C83.4292 47.8833 83.5714 47.9081 83.7136 47.9377Z'
      fill='#FFCDCA'
    />
    <path
      d='M85.9626 48.5551V80.9014L85.5352 80.7659V48.4062C85.6783 48.4521 85.8214 48.5026 85.9626 48.5551Z'
      fill='#FFCDCA'
    />
    <path
      d='M88.2116 49.6086V81.5284C88.0675 81.5036 87.9254 81.474 87.7832 81.4425V49.3682C87.809 49.3806 87.8338 49.3939 87.8576 49.4073C87.9769 49.4741 88.0943 49.5399 88.2116 49.6086Z'
      fill='#FFCDCA'
    />
    <path
      d='M90.4597 51.2249V81.6523C90.3175 81.6619 90.1734 81.6676 90.0312 81.6705V50.8633C90.1763 50.981 90.3191 51.1015 90.4597 51.2249Z'
      fill='#FFCDCA'
    />
    <path
      d='M92.7077 53.7306V81.224C92.64 81.2469 92.5722 81.2678 92.5035 81.2879L92.3385 81.3346L92.2793 81.3509V53.1533C92.3642 53.2602 92.4463 53.369 92.5264 53.4787C92.5885 53.5607 92.6486 53.6457 92.7077 53.7306Z'
      fill='#FFCDCA'
    />
    <path
      d='M94.9598 58.4704V80.1434C94.892 80.1892 94.8233 80.2388 94.7546 80.277C94.6859 80.3151 94.6258 80.3562 94.5638 80.3943L94.5352 80.4124V57.2939L94.7823 57.9743L94.9388 58.4027L94.9598 58.4704Z'
      fill='#FFCDCA'
    />
    <path
      d='M97.2048 64.6501V78.0295C97.159 78.0896 97.1094 78.1506 97.0636 78.2088C96.9701 78.3246 96.8747 78.4382 96.7773 78.5495V63.4736L97.2048 64.6501Z'
      fill='#FFCDCA'
    />
    <path
      d='M54.3796 51.8008V64.7937L54.268 64.7192L53.9512 64.5084V52.3437C54.0886 52.1586 54.2307 51.9773 54.3796 51.8008Z'
      fill='#FFCDCA'
    />
    <path
      d='M56.6276 49.7422V66.2913L56.1992 66.005V50.0551C56.3395 49.9464 56.4826 49.8452 56.6276 49.7422Z'
      fill='#FFCDCA'
    />
    <path
      d='M58.8776 48.5225V67.7842L58.4492 67.498V48.7009C58.5904 48.6427 58.7326 48.5807 58.8776 48.5225Z'
      fill='#FFCDCA'
    />
    <path
      d='M61.1257 47.8721V69.2864L61.0217 69.2168L60.6973 69.0002V47.9589C60.8385 47.9264 60.9826 47.8978 61.1257 47.8721Z'
      fill='#FFCDCA'
    />
    <path
      d='M63.3757 47.6885V70.7793L62.9473 70.4931V47.6885H63.1801H63.3757Z'
      fill='#FFCDCA'
    />
    <path
      d='M65.6218 47.6885V72.2793L65.1934 71.9949V47.6885H65.6218Z'
      fill='#FFCDCA'
    />
    <path
      d='M67.8698 47.6885V73.7773L67.7735 73.7134L67.4414 73.4911V47.6885H67.8698Z'
      fill='#FFCDCA'
    />
    <path
      d='M85.7002 67.5098L82.2461 60.4365'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M65.3091 70.4641H58.9982L57.7761 61.6038C57.7575 61.4696 57.753 61.3272 57.7629 61.1882C57.7728 61.0492 57.7968 60.9176 57.833 60.8039C57.8691 60.6903 57.9164 60.5979 57.971 60.5342C58.0257 60.4705 58.086 60.4374 58.1472 60.4375H63.4571C63.5932 60.4374 63.7257 60.537 63.8355 60.7218C63.9453 60.9065 64.0266 61.1669 64.0678 61.4652L65.3091 70.4641Z'
      fill='#6B2824'
    />
    <path
      d='M36.6875 55.1027C36.6875 54.1664 37.0594 53.2684 37.7215 52.6063C38.3836 51.9442 39.2816 51.5723 40.2179 51.5723'
      stroke='white'
      strokeWidth={1.17722}
      strokeMiterlimit={10}
      strokeLinecap='round'
    />
    <path
      d='M34.2891 55.1031C34.2901 53.5311 34.9154 52.0238 36.0274 50.9127C37.1394 49.8015 38.6472 49.1775 40.2192 49.1777'
      stroke='white'
      strokeWidth={1.17722}
      strokeMiterlimit={10}
      strokeLinecap='round'
    />
    <path
      d='M96.1313 79.5939C93.2478 83.0356 86.8301 81.6616 85.0277 80.9298C79.9925 78.8783 73.4202 73.3069 71.9861 72.4377C71.762 72.2625 71.4881 72.1627 71.2038 72.1526C70.9194 72.1425 70.6392 72.2226 70.4031 72.3814L66.8937 75.1866C65.9854 75.8269 65.0741 75.8603 64.2345 75.1323L59.7031 71.3022L58.7432 71.8118C58.2512 72.082 57.6724 72.1472 57.1326 71.993C56.9736 71.9405 56.8328 71.8438 56.7267 71.7142C56.6206 71.5846 56.5537 71.4275 56.5337 71.2612C56.5136 71.095 56.5414 70.9264 56.6137 70.7754C56.6859 70.6243 56.7998 70.4969 56.9418 70.4082L64.327 65.7566C66.2433 64.502 68.4839 63.8335 70.7743 63.833H71.2514C72.5435 63.833 73.8325 63.958 75.1005 64.2061L90.2622 67.8128C95.0817 68.6058 101.059 73.7134 96.1313 79.5939Z'
      fill='#B4433C'
    />
    <path
      d='M59.7617 71.3185L63.3799 69.1201'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M61.5879 72.7026L65.0286 70.6406'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M63.3477 74.2397L66.7893 72.1768'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M79.5484 81.554L77.7403 83.6102C75.2785 86.4109 71.9189 88.2676 68.2377 88.8618C64.5565 89.456 60.7833 88.7507 57.5654 86.8668L40.4171 76.8289C40.1042 76.6461 39.7372 76.5785 39.3798 76.6379C39.0223 76.6974 38.697 76.8801 38.4601 77.1543L20.2937 98.1994L14.501 93.607C13.958 93.1736 13.5564 92.5883 13.3474 91.9258L12.6919 89.8438C12.3457 88.7455 11.6816 87.7745 10.7835 87.0538L9.04883 85.6674L31.2542 61.5699C33.1794 59.4614 35.7958 58.1117 38.6299 57.7651C41.464 57.4186 44.3285 58.0981 46.705 59.6806L79.5484 81.554Z'
      fill='white'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinejoin='round'
    />
    <path
      d='M61.9733 89.048L46.7734 89.0137C46.553 89.0131 46.3346 89.0559 46.1308 89.1399C45.9269 89.2238 45.7417 89.3471 45.5856 89.5028C45.4295 89.6584 45.3056 89.8433 45.2211 90.0469C45.1366 90.2505 45.0931 90.4688 45.0931 90.6892V111.62H37.7279C37.0329 111.62 36.3537 111.413 35.7766 111.025L33.9637 109.81C33.0069 109.168 31.8806 108.824 30.7282 108.824H28.5078C28.5298 108.585 28.5421 108.347 28.5421 108.098V83.6809C28.5421 77.5599 35.186 73.7489 40.4692 76.8395L61.9733 89.048Z'
      fill='white'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinejoin='round'
    />
    <path
      d='M45.0974 111.619V112.901C45.0972 113.67 44.7919 114.406 44.2487 114.949C43.7055 115.493 42.9688 115.798 42.2006 115.798H23.7852L25.8547 113.999C27.3728 112.679 28.3239 110.826 28.5102 108.823H30.7305C31.883 108.824 33.0092 109.167 33.9661 109.809L35.779 111.025C36.3561 111.412 37.0353 111.619 37.7303 111.619H45.0974Z'
      fill='#B0DFFF'
    />
    <path
      d='M45.0974 111.619V112.901C45.0972 113.67 44.7919 114.406 44.2487 114.949C43.7055 115.493 42.9688 115.798 42.2006 115.798H23.7852L25.8547 113.999C27.3728 112.679 28.3239 110.826 28.5102 108.823H30.7305C31.883 108.824 33.0092 109.167 33.9661 109.809L35.779 111.025C36.3561 111.412 37.0353 111.619 37.7303 111.619H45.0974Z'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M45.0973 111.619V112.312C45.0973 112.312 44.0859 114.572 42.8359 114.572H25.1953L25.8537 114C27.3718 112.68 28.3228 110.827 28.5091 108.824H30.7295C31.8819 108.825 33.0082 109.168 33.9651 109.81L35.778 111.025C36.355 111.413 37.0342 111.62 37.7292 111.62L45.0973 111.619Z'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M45.0974 112.312V112.901C45.0972 113.669 44.7919 114.406 44.2487 114.949C43.7055 115.493 42.9688 115.798 42.2006 115.798H23.7852L25.1964 114.572H42.837C44.086 114.572 45.0974 112.312 45.0974 112.312Z'
      fill='white'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinejoin='round'
    />
    <path
      d='M20.257 98.2076L19.4564 99.2094C18.9763 99.8092 18.2778 100.194 17.5142 100.279C16.7507 100.364 15.9846 100.143 15.3841 99.6636L1 88.165L3.74036 88.0505C5.74987 87.9678 7.65011 87.1134 9.04554 85.665L10.7802 87.0514C11.6783 87.7722 12.3424 88.7431 12.6885 89.8414L13.345 91.9234C13.5534 92.586 13.9547 93.1714 14.4976 93.6047L20.257 98.2076Z'
      fill='#B0DFFF'
    />
    <path
      d='M20.257 98.2076L19.4564 99.2094C18.9763 99.8092 18.2778 100.194 17.5142 100.279C16.7507 100.364 15.9846 100.143 15.3841 99.6636L1 88.165L3.74036 88.0505C5.74987 87.9678 7.65011 87.1134 9.04554 85.665L10.7802 87.0514C11.6783 87.7722 12.3424 88.7431 12.6885 89.8414L13.345 91.9234C13.5534 92.586 13.9547 93.1714 14.4976 93.6047L20.257 98.2076Z'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M20.2579 98.2076L19.8256 98.7486C19.8256 98.7486 17.6244 99.8821 16.6483 99.1016L2.86914 88.0877L3.74124 88.0505C5.75074 87.9678 7.65098 87.1134 9.04642 85.665L10.7811 87.0514C11.6792 87.7722 12.3433 88.7431 12.6894 89.8414L13.3459 91.9234C13.5542 92.586 13.9556 93.1714 14.4985 93.6047L20.2579 98.2076Z'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M19.8248 98.7488L19.4564 99.2097C18.9763 99.8094 18.2778 100.194 17.5142 100.279C16.7507 100.364 15.9846 100.143 15.3841 99.6638L1 88.1652L2.86827 88.0879L16.6474 99.1018C17.6235 99.8823 19.8248 98.7488 19.8248 98.7488Z'
      fill='white'
      stroke='#6B2824'
      strokeWidth={1.17722}
      strokeLinejoin='round'
    />
    <path
      d='M69.8926 52.1742L77.5822 47.6886L74.9621 42.6191L69.8926 44.2059V52.1742Z'
      fill='#B4433C'
    />
    <path
      d='M69.8926 44.2549V52.1745L77.5822 47.6889'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M69.8926 47.7545L73.5308 45.5055C73.9683 45.2348 74.3294 44.8568 74.5798 44.4075C74.8303 43.9581 74.9619 43.4523 74.9621 42.9378V42.6191L69.8926 44.2059V47.7545Z'
      fill='#6B2824'
    />
    <path
      d='M76.4792 41.367V41.6762C76.4792 42.0123 76.3457 42.3347 76.1081 42.5725C75.8705 42.8103 75.5482 42.944 75.212 42.9443H74.3409L74.1682 43.2801C73.9487 43.7095 73.6213 44.0744 73.2181 44.3389C72.8149 44.6034 72.3499 44.7584 71.8686 44.7887L70.1893 44.8841C70.0228 44.8944 69.856 44.8705 69.6992 44.8139C69.5423 44.7572 69.3987 44.6691 69.2772 44.5548C69.1557 44.4406 69.0589 44.3026 68.9928 44.1496C68.9266 43.9965 68.8925 43.8314 68.8926 43.6647V39.91C68.8926 39.3568 69.1123 38.8263 69.5035 38.4351C69.8947 38.044 70.4252 37.8242 70.9784 37.8242H71.6148C72.0862 37.8242 72.5436 37.9839 72.9125 38.2773C73.2815 38.5706 73.5401 38.9804 73.6462 39.4396L73.9067 40.5646C73.9999 40.4217 74.1272 40.3042 74.2771 40.2228C74.4271 40.1413 74.5949 40.0984 74.7655 40.098H75.2082C75.3751 40.0976 75.5403 40.1302 75.6946 40.1938C75.8488 40.2574 75.989 40.3508 76.1071 40.4687C76.2251 40.5866 76.3188 40.7267 76.3826 40.8808C76.4465 41.035 76.4793 41.2002 76.4792 41.367Z'
      fill='#B4433C'
    />
    <path
      d='M68.998 39.9941H70.1039L69.874 42.2679H70.5667'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M71.3828 39.9922L72.7492 40.101'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M75.2637 40.9365C75.0544 40.9365 74.8537 41.0197 74.7057 41.1676C74.5577 41.3156 74.4746 41.5163 74.4746 41.7256'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M71.861 41.5215C71.9838 41.5215 72.0833 41.3446 72.0833 41.1265C72.0833 40.9083 71.9838 40.7314 71.861 40.7314C71.7382 40.7314 71.6387 40.9083 71.6387 41.1265C71.6387 41.3446 71.7382 41.5215 71.861 41.5215Z'
      fill='#6B2824'
    />
    <path
      d='M69.1852 41.5215C69.308 41.5215 69.4075 41.3446 69.4075 41.1265C69.4075 40.9083 69.308 40.7314 69.1852 40.7314C69.0624 40.7314 68.9629 40.9083 68.9629 41.1265C68.9629 41.3446 69.0624 41.5215 69.1852 41.5215Z'
      fill='#6B2824'
    />
    <path
      d='M70.1113 43.2804H70.6342C70.8701 43.2806 71.0978 43.1944 71.2745 43.0381'
      stroke='#6B2824'
      strokeWidth={0.941772}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M75.9302 39.0635C75.9308 39.4568 75.793 39.8379 75.5408 40.1398C75.4336 40.1106 75.3229 40.0958 75.2117 40.0959H74.768C74.5974 40.0963 74.4296 40.1392 74.2797 40.2207C74.1297 40.3021 74.0024 40.4196 73.9092 40.5625L73.6487 39.4375C73.5803 39.1397 73.4467 38.8608 73.2575 38.6208C73.0761 38.8414 72.8364 39.0067 72.5658 39.0978C72.3926 39.1576 72.2107 39.1879 72.0276 39.1875C71.6853 39.1899 71.3511 39.0833 71.0734 38.8832C70.9099 38.7679 70.7727 38.6193 70.6708 38.4471C70.569 38.2749 70.5049 38.083 70.4828 37.8841C70.0941 37.9792 69.7409 38.1839 69.4653 38.4741C69.1897 38.7642 69.0034 39.1275 68.9285 39.5205C68.705 39.4162 68.5071 39.2639 68.3489 39.0747C68.1907 38.8854 68.0761 38.6637 68.013 38.4252C67.9499 38.1867 67.94 37.9373 67.984 37.6945C68.0279 37.4518 68.1247 37.2217 68.2674 37.0205C68.4101 36.8193 68.5952 36.6518 68.8098 36.5301C69.0243 36.4083 69.2629 36.3351 69.5089 36.3157C69.7548 36.2964 70.002 36.3313 70.2329 36.4179C70.4639 36.5046 70.673 36.641 70.8454 36.8174C70.9961 36.6558 71.1788 36.5273 71.3818 36.4401C71.5848 36.3528 71.8038 36.3088 72.0247 36.3107C72.8005 36.3107 73.4426 36.8393 73.5562 37.5292C73.7729 37.4311 74.0082 37.3807 74.246 37.3813C74.6924 37.3813 75.1204 37.5585 75.4362 37.8739C75.752 38.1893 75.9296 38.6172 75.9302 39.0635Z'
      fill='#FE5F55'
    />
  </svg>
);

export const DelveryCompany = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={91}
    height={117}
    viewBox='0 0 91 117'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <circle cx={58.5018} cy={58.4999} r={57.9862} fill='#E6F5FF' />
    <mask
      id='mask0_4759_8577'
      maskUnits='userSpaceOnUse'
      x={0}
      y={0}
      width={117}
      height={117}
      style={{
        maskType: 'alpha',
      }}
    >
      <circle cx={58.5} cy={58.5} r={58.5} fill='#C4C4C4' />
    </mask>
    <g mask='url(#mask0_4759_8577)'>
      <path
        d='M32.3415 86.7589C31.8367 84.5634 30.6023 82.6041 28.8399 81.2009C27.0774 79.7978 24.8913 79.034 22.6385 79.0341C20.7323 79.0341 18.8633 78.5056 17.2394 77.5073C15.6154 76.509 14.3001 75.0799 13.4395 73.379L10.6397 67.8434C9.30452 65.204 7.11872 63.0917 4.43527 61.8474C1.75181 60.6032 -1.27269 60.2996 -4.14988 60.9859C-7.02707 61.6721 -9.58901 63.308 -11.422 65.6294C-13.2551 67.9508 -14.2522 70.8223 -14.2524 73.7802V75.8729C-12.6997 75.9788 -11.2009 76.4856 -9.90259 77.3438C-8.60422 78.202 -7.55064 79.3822 -6.84474 80.7693C-7.68668 79.712 -8.75645 78.8584 -9.97428 78.2722C-11.1921 77.686 -12.5266 77.3822 -13.8781 77.3836C-14.0033 77.3836 -14.1284 77.3864 -14.2524 77.3915C-16.5729 77.4868 -18.7666 78.4756 -20.3747 80.1511C-21.9829 81.8266 -22.8809 84.0591 -22.8809 86.3815C-22.8809 88.7039 -21.9829 90.9363 -20.3747 92.6118C-18.7666 94.2873 -16.5729 95.2762 -14.2524 95.3715L45.64 95.3793C37.3563 95.3776 33.5026 91.8034 32.3415 86.7589ZM-15.4051 83.1207C-15.6331 83.1207 -15.856 83.0531 -16.0455 82.9264C-16.2351 82.7998 -16.3828 82.6197 -16.4701 82.4091C-16.5573 82.1985 -16.5801 81.9667 -16.5357 81.7431C-16.4912 81.5195 -16.3814 81.3141 -16.2202 81.1529C-16.059 80.9917 -15.8536 80.8819 -15.63 80.8375C-15.4064 80.793 -15.1746 80.8158 -14.964 80.903C-14.7534 80.9903 -14.5734 81.138 -14.4467 81.3276C-14.3201 81.5172 -14.2524 81.74 -14.2524 81.968C-14.2524 82.2737 -14.3739 82.5669 -14.5901 82.7831C-14.8062 82.9992 -15.0994 83.1207 -15.4051 83.1207Z'
        fill='#B0DFFF'
      />
      <path
        d='M38.3204 58.9277H60.1911V59.3352C60.1911 60.1718 59.8588 60.9741 59.2672 61.5657C58.6756 62.1573 57.8733 62.4896 57.0367 62.4896H35.5684V61.6793C35.5681 61.3178 35.6392 60.9599 35.7774 60.6259C35.9156 60.2919 36.1184 59.9885 36.374 59.7329C36.6296 59.4774 36.933 59.2747 37.267 59.1366C37.601 58.9984 37.959 58.9274 38.3204 58.9277Z'
        fill='#2D3035'
      />
      <path
        d='M28.5039 95.377C33.2738 95.377 37.1406 91.5102 37.1406 86.7402C37.1406 81.9703 33.2738 78.1035 28.5039 78.1035C23.734 78.1035 19.8672 81.9703 19.8672 86.7402C19.8672 91.5102 23.734 95.377 28.5039 95.377Z'
        fill='#2D3035'
      />
      <path
        d='M20.3145 83.9876C20.9679 82.046 22.29 80.3999 24.0449 79.343C25.7998 78.286 27.8732 77.8872 29.895 78.2176C31.9167 78.548 33.7553 79.5862 35.0824 81.1468C36.4095 82.7074 37.1388 84.6889 37.1401 86.7375L20.3145 83.9876Z'
        fill='black'
      />
      <path
        d='M28.5089 89.217C29.8751 89.217 30.9826 88.1095 30.9826 86.7432C30.9826 85.377 29.8751 84.2695 28.5089 84.2695C27.1427 84.2695 26.0352 85.377 26.0352 86.7432C26.0352 88.1095 27.1427 89.217 28.5089 89.217Z'
        stroke='white'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
      />
      <path
        d='M95.0421 45.369C95.0422 46.3474 94.6941 47.2938 94.0601 48.039C93.4261 48.7841 92.5476 49.2793 91.5818 49.436C90.6161 49.5926 89.6261 49.4004 88.7891 48.8938C87.9521 48.3872 87.3228 47.5992 87.0137 46.6709L93.9663 42.5928C94.6597 43.3509 95.0436 44.3416 95.0421 45.369Z'
        fill='#FEEFBC'
      />
      <path
        d='M93.9686 42.5939L87.016 46.6721C86.7174 45.7762 86.7357 44.805 87.0678 43.921C87.3999 43.0371 88.0255 42.294 88.84 41.8162C89.6545 41.3384 90.6084 41.155 91.5421 41.2966C92.4757 41.4382 93.3323 41.8962 93.9686 42.5939Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M53.2596 85.8931V62.4915H37.0867C25.355 62.4915 15.5931 71.5104 14.6699 83.2056H34.8728C36.2319 83.2056 37.5757 83.4917 38.817 84.0453C40.0582 84.5988 41.1691 85.4074 42.0773 86.4184L45.0163 89.6895C45.5992 90.3388 46.3124 90.8581 47.1093 91.2135C47.9062 91.5689 48.769 91.7526 49.6416 91.7525H90.0524C91.6544 91.7524 93.2274 91.325 94.6092 90.5145L116.451 77.6997C116.451 77.6997 114.081 70.0591 104.231 72.1058L87.3491 44.4902C87.0411 43.9864 86.6089 43.5703 86.0939 43.2815C85.5789 42.9927 84.9984 42.841 84.4079 42.8408H81.2709V44.3527H82.5958C83.2591 44.3525 83.9083 44.5435 84.4657 44.903C85.0231 45.2624 85.465 45.7749 85.7385 46.3791L96.0464 69.1696C100.29 78.5499 93.4307 89.1817 83.1351 89.1817H56.5465C56.1147 89.1817 55.6872 89.0966 55.2883 88.9313C54.8894 88.766 54.527 88.5238 54.2217 88.2184C53.9165 87.913 53.6744 87.5504 53.5093 87.1515C53.3442 86.7525 53.2594 86.3249 53.2596 85.8931Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M16.6719 83.1512C17.6018 77.4271 22.57 73.0537 28.5585 73.0537C35.2097 73.0537 40.6016 78.4456 40.6016 85.0969'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
      />
      <path
        d='M81.429 44.6911C82.379 44.6911 83.1491 43.921 83.1491 42.971C83.1491 42.0211 82.379 41.251 81.429 41.251C80.4791 41.251 79.709 42.0211 79.709 42.971C79.709 43.921 80.4791 44.6911 81.429 44.6911Z'
        fill='black'
      />
      <path
        d='M83.0809 31.339C84.2547 29.7538 84.7182 28.1074 84.1162 27.6616C83.5142 27.2158 82.0746 28.1394 80.9007 29.7246C79.7269 31.3097 79.2634 32.9561 79.8655 33.4019C80.4675 33.8477 81.9071 32.9241 83.0809 31.339Z'
        fill='#BABFC3'
      />
      <path
        d='M82.6546 30.9753C83.8658 29.3396 84.344 27.6405 83.7225 27.1803C83.101 26.7201 81.6153 27.6731 80.4041 29.3088C79.1928 30.9445 78.7147 32.6436 79.3362 33.1038C79.9576 33.5639 81.4433 32.611 82.6546 30.9753Z'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M86.264 43.3856V36.7691C86.2638 35.8675 85.9298 34.9978 85.3262 34.328L81.5938 30.1875'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M53.2588 62.4912V71.2338L33.1484 62.6192V62.6102C33.7176 62.5317 34.2918 62.4929 34.8711 62.4938L53.2588 62.4912Z'
        fill='#00406B'
        fillOpacity={0.15}
      />
      <path
        d='M28.5039 95.377H124.435'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
      />
      <path
        d='M61.2949 98.415H116.447'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
      />
      <path
        d='M77.364 84.8749C71.2675 86.5627 65.0961 85.4811 63.3218 85.1023L77.0029 56.8985V83.3455V83.3456C77.0035 83.8768 77.1272 84.4002 77.364 84.8749Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.135978}
      />
      <path
        d='M80.0175 88.6663V89.1776H65.7352C63.6588 89.1776 62.2743 87.0411 63.111 85.1499C64.7806 85.513 71.1114 86.669 77.349 84.917C77.5783 85.3494 77.8993 85.7265 78.2896 86.022L78.9529 86.5271C79.2835 86.7772 79.5517 87.1005 79.7364 87.4717C79.9211 87.8428 80.0173 88.2517 80.0175 88.6663Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
      />
      <path
        d='M80.9028 58.8416L68.7957 83.8348C68.579 84.2834 68.5389 84.797 68.6834 85.2737C68.6834 85.2737 60.9126 88.4164 53.6856 87.4826C53.4346 87.0381 53.2905 86.5413 53.2645 86.0316C53.2384 85.5218 53.3313 85.013 53.5358 84.5453L63.6238 61.1998C63.7386 60.9339 63.7856 60.6437 63.7605 60.3552C63.7354 60.0667 63.639 59.789 63.4799 59.547C63.3209 59.3049 63.1042 59.1063 62.8493 58.9687C62.5945 58.8312 62.3095 58.7592 62.0199 58.7591H47.5412C46.2388 58.7591 44.9515 58.4804 43.7657 57.9419C42.5799 57.4033 41.523 56.6173 40.666 55.6367L60.2218 46.8086H73.3615C79.5447 46.808 83.5982 53.2752 80.9028 58.8416Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M65.1205 50.2998C71.3037 50.2998 75.3572 56.7675 72.6618 62.3317L60.5547 87.3249'
        fill='white'
      />
      <path
        d='M65.1205 50.2998C71.3037 50.2998 75.3572 56.7675 72.6618 62.3317L60.5547 87.3249'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
        strokeDasharray='0.54 0.54'
      />
      <path
        d='M70.9778 89.1785H56.5805C55.9898 89.1806 55.4094 89.0242 54.8999 88.7254C54.3903 88.4267 53.9703 87.9967 53.6836 87.4803C60.9106 88.4125 68.6814 85.2715 68.6814 85.2715C68.7834 85.6112 68.9749 85.9173 69.2359 86.1576L69.9396 86.8086C70.267 87.1104 70.5284 87.4768 70.707 87.8847C70.8857 88.2926 70.9779 88.7332 70.9778 89.1785Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
      />
      <path
        d='M64.2995 21.046L61.9921 24.3193C60.5788 23.3481 58.9037 22.8295 57.1888 22.8323H53.6222C53.4302 22.8323 53.2384 22.8353 53.0469 22.8413L58.0801 18.2598L64.2995 21.046Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.182707}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M66.0916 15.1556L66.6534 18.6084C66.6756 18.7978 66.6281 18.9888 66.5197 19.1458C66.4113 19.3027 66.2495 19.4148 66.0645 19.4612L66.017 19.4725C65.8326 19.5175 65.6661 19.6172 65.5393 19.7585C65.4126 19.8998 65.3315 20.0761 65.3066 20.2642L65.1558 21.4119C65.1243 21.6489 65.0002 21.8637 64.8108 22.0095C64.6213 22.1553 64.3818 22.2202 64.1447 22.1901C62.85 22.0174 60.5486 21.3968 59.9115 19.1648C59.0104 16.0084 62.3666 15.1533 62.3666 15.1533L66.0916 15.1556Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.182707}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M63.207 16.3383C63.207 16.3383 63.9392 15.9107 64.5862 15.8994'
        stroke='#00406B'
        strokeWidth={0.182707}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M64.1888 17.808C64.3179 17.808 64.4226 17.6223 64.4226 17.3932C64.4226 17.1642 64.3179 16.9785 64.1888 16.9785C64.0597 16.9785 63.9551 17.1642 63.9551 17.3932C63.9551 17.6223 64.0597 17.808 64.1888 17.808Z'
        fill='#00406B'
      />
      <path
        d='M65.2803 20.3072C64.4011 20.3072 64.2148 19.4521 64.2148 19.4521'
        stroke='#00406B'
        strokeWidth={0.182707}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M55.6374 18.8172L55.5028 18.5224C54.8531 17.1076 54.7916 15.4929 55.3316 14.0327C55.8716 12.5726 56.9691 11.3865 58.3829 10.7349L59.1366 10.387C59.8082 10.0772 60.539 9.9168 61.2786 9.91699C62.0182 9.91719 62.749 10.0779 63.4204 10.3881C64.0918 10.6983 64.6879 11.1506 65.1674 11.7137C65.647 12.2767 65.9986 12.9372 66.198 13.6494L66.6578 15.2905H62.9532C62.4758 15.2905 62.0179 15.4801 61.6803 15.8177C61.3427 16.1553 61.153 16.6132 61.153 17.0907V17.6901C61.153 18.406 60.8686 19.0926 60.3624 19.5988C59.8562 20.105 59.1696 20.3894 58.4537 20.3894H58.0901C57.5737 20.3895 57.0681 20.2415 56.6333 19.9628C56.1986 19.6841 55.8529 19.2865 55.6374 18.8172Z'
        fill='#00406B'
      />
      <path
        d='M63.2711 22.8482C63.2506 22.848 63.2302 22.8468 63.21 22.8444C62.7485 22.7871 61.7253 22.5058 60.8144 21.8144C59.709 20.9744 59.1645 19.8267 59.2392 18.4966C59.2465 18.3666 59.3051 18.2448 59.4022 18.1581C59.4993 18.0713 59.6268 18.0267 59.7568 18.034C59.8868 18.0413 60.0086 18.0999 60.0953 18.197C60.1821 18.2941 60.2267 18.4216 60.2194 18.5516C60.0852 20.948 62.6814 21.794 63.3321 21.8694C63.4621 21.8773 63.5837 21.9365 63.67 22.034C63.7563 22.1315 63.8004 22.2593 63.7925 22.3893C63.7846 22.5193 63.7254 22.6409 63.6279 22.7272C63.5304 22.8135 63.4026 22.8576 63.2726 22.8497L63.2711 22.8482Z'
        fill='#00406B'
      />
      <path
        d='M59.7568 18.4961C60.4294 18.4961 60.9746 17.9509 60.9746 17.2783C60.9746 16.6058 60.4294 16.0605 59.7568 16.0605C59.0843 16.0605 58.5391 16.6058 58.5391 17.2783C58.5391 17.9509 59.0843 18.4961 59.7568 18.4961Z'
        stroke='white'
        strokeWidth={0.182707}
        strokeMiterlimit={10}
      />
      <path
        d='M76.7447 41.4335C76.7447 44.5049 76.032 47.06 75.1527 47.06C74.2733 47.06 73.5605 44.5049 73.5605 41.4335C73.5605 38.3621 74.2733 35.834 75.1527 35.834C76.032 35.834 76.7447 38.3621 76.7447 41.4335Z'
        fill='white'
        stroke='#075589'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
      />
      <path
        d='M84.9129 38.4531V43.9562H84.1346C83.8729 43.9562 83.622 43.8522 83.4369 43.6672C83.2519 43.4822 83.148 43.2313 83.148 42.9696C83.148 42.5135 82.9669 42.076 82.6444 41.7533C82.322 41.4307 81.8846 41.2493 81.4285 41.249C80.9724 41.2494 80.535 41.4309 80.2125 41.7535C79.8901 42.0761 79.7088 42.5135 79.7085 42.9696C79.7086 43.507 79.6029 44.0391 79.3973 44.5356C79.1917 45.0321 78.8904 45.4832 78.5104 45.8632C78.1304 46.2431 77.6793 46.5445 77.1828 46.7501C76.6863 46.9557 76.1542 47.0614 75.6168 47.0612H75.4378H75.3957C74.536 46.981 73.8457 44.4596 73.8457 41.4364C73.8457 40.052 73.991 38.7781 74.2301 37.7966L76.3346 36.8178L77.5103 36.2712C78.1155 35.9899 78.7958 35.9129 79.4486 36.0518L83.6996 36.9553C84.0427 37.0286 84.3502 37.2173 84.571 37.4898C84.7918 37.7624 84.9125 38.1024 84.9129 38.4531Z'
        fill='white'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M80.9219 38.543L83.6953 39.1322C84.0388 39.2055 84.3467 39.3944 84.5677 39.6674C84.7886 39.9405 84.9091 40.2811 84.9091 40.6323V43.8978'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M76.1197 41.8386C76.1197 44.9106 75.407 47.4651 74.5277 47.4651H74.4856C73.6258 47.3848 72.9355 44.8634 72.9355 41.8403C72.9355 40.4558 73.0809 39.1819 73.32 38.2004L75.4244 37.2217C75.8448 38.2324 76.1197 39.9305 76.1197 41.8386Z'
        fill='#FE5F55'
        fillOpacity={0.2}
      />
      <path
        d='M54.6582 50.4226C51.9892 48.6829 49.4346 45.8309 50.1917 37.2217'
        stroke='white'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M54.4713 50.3938C49.8404 55.5455 40.6621 55.6353 40.6621 55.6353V45.8291C41.0168 52.3687 50.8645 48.9409 52.1861 48.4544C52.8568 49.2625 53.6789 49.8719 54.4713 50.3938Z'
        fill='#FFDFDD'
      />
      <path
        d='M40.663 30.1846V55.6357H24.6691C22.3121 55.6357 20.3395 54.28 19.8603 52.4708C19.7854 52.19 19.7478 51.9041 19.748 51.6175V34.2023C19.748 34.1933 19.748 34.1838 19.748 34.1744C19.7507 33.7359 19.8421 33.3003 20.0191 32.883C20.6875 31.3119 22.5158 30.1846 24.6674 30.1846H40.663Z'
        fill='#FE5F55'
        stroke='#00406B'
        strokeWidth={0.135978}
        strokeMiterlimit={10}
        strokeLinecap='round'
      />
      <path
        d='M36.0593 45.5404V47.4639H29.013C26.4482 47.4548 24.3672 45.3854 24.3672 42.8237C24.3672 41.5475 24.8874 40.3806 25.7272 39.5419C26.5669 38.7032 27.726 38.1836 29.013 38.1836H32.025C33.5858 38.1836 34.9366 39.0587 35.612 40.3532L32.6913 41.7936C32.3353 41.1555 31.6417 40.7179 30.8567 40.7179C29.6975 40.7179 28.7483 41.6569 28.7483 42.8237C28.7483 43.9815 29.6884 44.9296 30.8567 44.9296C31.6325 44.9296 32.2988 44.5193 32.673 43.8994L36.0593 45.5404Z'
        fill='white'
        fillOpacity={0.95}
      />
      <path
        d='M32.9559 42.8231C32.9559 43.2151 32.8464 43.5797 32.6638 43.8988L30.5098 42.8596L32.6821 41.793C32.8555 42.0938 32.9559 42.4493 32.9559 42.8231Z'
        fill='white'
      />
      <path
        d='M54.6326 50.5189L54.6 50.4971L54.569 50.5209L54.6021 50.5642L54.5689 50.5209L54.5688 50.521L54.5684 50.5213L54.5666 50.5227L54.5594 50.5282L54.5307 50.5497C54.5054 50.5687 54.4677 50.5966 54.4187 50.6321C54.3206 50.7033 54.1771 50.8053 53.9955 50.9284C53.6323 51.1746 53.1171 51.505 52.5093 51.8418C51.2919 52.5162 49.7092 53.2126 48.2332 53.3145C46.736 53.4179 45.4328 53.8868 44.21 54.3778C44.0352 54.448 43.8622 54.5185 43.6906 54.5886C42.6803 55.0007 41.7173 55.3935 40.7264 55.5706V41.9906C40.7264 39.13 42.0063 34.8554 43.4168 31.0157C44.352 28.4719 46.0453 26.2764 48.2682 24.7257C50.491 23.175 53.1362 22.3439 55.8465 22.3446H58.5031C60.1661 22.3446 61.7609 23.0052 62.9368 24.181C64.1126 25.3569 64.7732 26.9517 64.7732 28.6147V35.8658C64.7732 36.0952 64.8238 36.3218 64.9215 36.5295C65.0191 36.7371 65.1614 36.9206 65.3382 37.0669C65.5149 37.2132 65.7218 37.3187 65.944 37.3759C66.1662 37.433 66.3983 37.4404 66.6236 37.3975L74.903 35.8226C74.7645 35.9973 74.6365 36.2369 74.5203 36.5263C74.3734 36.8921 74.2437 37.3419 74.136 37.8509C73.9205 38.8691 73.7921 40.1281 73.7921 41.4334C73.7916 42.9726 73.9698 44.3845 74.2595 45.4132C74.4042 45.9271 74.5776 46.3485 74.7724 46.6427C74.9256 46.8739 75.0977 47.0347 75.2859 47.0916C75.2771 47.0971 75.2678 47.1029 75.2581 47.109C75.1595 47.1706 75.0138 47.2604 74.8255 47.3729C74.4491 47.5978 73.9027 47.9136 73.2232 48.2767C71.8641 49.0029 69.9735 49.9179 67.8464 50.6736C63.5876 52.1867 58.4021 53.0537 54.6326 50.5189Z'
        fill='#E7564D'
        stroke='#00406B'
        strokeWidth={0.109036}
      />
      <path
        d='M54.5768 50.5799C52.0356 49.0068 48.6433 43.3803 55.9037 34.0869'
        stroke='#00406B'
        strokeWidth={0.109036}
      />
    </g>
  </svg>
);

export const ArrowBack = (props: SVGProps<SVGSVGElement>) => (
  <svg
    stroke='currentColor'
    fill='currentColor'
    strokeWidth={0}
    viewBox='0 0 512 512'
    height='1em'
    width='1em'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm28.9-143.6L209.4 288H392c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24H209.4l75.5-72.4c9.7-9.3 9.9-24.8.4-34.3l-11-10.9c-9.4-9.4-24.6-9.4-33.9 0L107.7 239c-9.4 9.4-9.4 24.6 0 33.9l132.7 132.7c9.4 9.4 24.6 9.4 33.9 0l11-10.9c9.5-9.5 9.3-25-.4-34.3z' />
  </svg>
);

export const IconMapPin: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        opacity={duotone ? '0.5' : '1'}
        d='M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <circle cx='12' cy='10' r='3' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  );
};

export const IconPhoneCall: FC<IconProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
  return (
    <>
      {!fill ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path
            d='M13.5 2C13.5 2 15.8335 2.21213 18.8033 5.18198C21.7731 8.15183 21.9853 10.4853 21.9853 10.4853'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            d='M14.207 5.53564C14.207 5.53564 15.197 5.81849 16.6819 7.30341C18.1668 8.78834 18.4497 9.77829 18.4497 9.77829'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M15.1007 15.0272L14.5569 14.5107L15.1007 15.0272ZM15.5562 14.5477L16.1 15.0642H16.1L15.5562 14.5477ZM17.9728 14.2123L17.5987 14.8623H17.5987L17.9728 14.2123ZM19.8833 15.312L19.5092 15.962L19.8833 15.312ZM20.4217 18.7584L20.9655 19.2749L20.4217 18.7584ZM19.0011 20.254L18.4573 19.7375L19.0011 20.254ZM17.6763 20.9631L17.7499 21.7095L17.6763 20.9631ZM7.81536 16.4752L8.35915 15.9587L7.81536 16.4752ZM3.00289 6.96594L2.25397 7.00613L2.25397 7.00613L3.00289 6.96594ZM9.47752 8.50311L10.0213 9.01963H10.0213L9.47752 8.50311ZM9.63424 5.6931L10.2466 5.26012L9.63424 5.6931ZM8.37326 3.90961L7.76086 4.3426V4.3426L8.37326 3.90961ZM5.26145 3.60864L5.80524 4.12516L5.26145 3.60864ZM3.69185 5.26114L3.14806 4.74462L3.14806 4.74462L3.69185 5.26114ZM11.0631 13.0559L11.6069 12.5394L11.0631 13.0559ZM15.6445 15.5437L16.1 15.0642L15.0124 14.0312L14.5569 14.5107L15.6445 15.5437ZM17.5987 14.8623L19.5092 15.962L20.2575 14.662L18.347 13.5623L17.5987 14.8623ZM19.8779 18.2419L18.4573 19.7375L19.5449 20.7705L20.9655 19.2749L19.8779 18.2419ZM17.6026 20.2167C16.1676 20.3584 12.4233 20.2375 8.35915 15.9587L7.27157 16.9917C11.7009 21.655 15.9261 21.8895 17.7499 21.7095L17.6026 20.2167ZM8.35915 15.9587C4.48303 11.8778 3.83285 8.43556 3.75181 6.92574L2.25397 7.00613C2.35322 8.85536 3.1384 12.6403 7.27157 16.9917L8.35915 15.9587ZM9.7345 9.32159L10.0213 9.01963L8.93372 7.9866L8.64691 8.28856L9.7345 9.32159ZM10.2466 5.26012L8.98565 3.47663L7.76086 4.3426L9.02185 6.12608L10.2466 5.26012ZM4.71766 3.09213L3.14806 4.74462L4.23564 5.77765L5.80524 4.12516L4.71766 3.09213ZM9.1907 8.80507C8.64691 8.28856 8.64622 8.28929 8.64552 8.29002C8.64528 8.29028 8.64458 8.29102 8.64411 8.29152C8.64316 8.29254 8.64219 8.29357 8.64121 8.29463C8.63924 8.29675 8.6372 8.29896 8.6351 8.30127C8.63091 8.30588 8.62646 8.31087 8.62178 8.31625C8.61243 8.32701 8.60215 8.33931 8.59116 8.3532C8.56918 8.38098 8.54431 8.41512 8.51822 8.45588C8.46591 8.53764 8.40917 8.64531 8.36112 8.78033C8.26342 9.0549 8.21018 9.4185 8.27671 9.87257C8.40742 10.7647 8.99198 11.9644 10.5193 13.5724L11.6069 12.5394C10.1793 11.0363 9.82761 10.1106 9.76086 9.65511C9.72866 9.43536 9.76138 9.31957 9.77432 9.28321C9.78159 9.26277 9.78635 9.25709 9.78169 9.26437C9.77944 9.26789 9.77494 9.27451 9.76738 9.28407C9.76359 9.28885 9.75904 9.29437 9.7536 9.30063C9.75088 9.30375 9.74793 9.30706 9.74476 9.31056C9.74317 9.31231 9.74152 9.3141 9.73981 9.31594C9.73896 9.31686 9.73809 9.31779 9.7372 9.31873C9.73676 9.3192 9.73608 9.31992 9.73586 9.32015C9.73518 9.32087 9.7345 9.32159 9.1907 8.80507ZM10.5193 13.5724C12.0422 15.1757 13.1923 15.806 14.0698 15.9485C14.5201 16.0216 14.8846 15.9632 15.1606 15.8544C15.2955 15.8012 15.4022 15.7387 15.4823 15.6819C15.5223 15.6535 15.5556 15.6266 15.5824 15.6031C15.5959 15.5913 15.6077 15.5803 15.618 15.5703C15.6232 15.5654 15.628 15.5606 15.6324 15.5562C15.6346 15.554 15.6367 15.5518 15.6387 15.5497C15.6397 15.5487 15.6407 15.5477 15.6417 15.5467C15.6422 15.5462 15.6429 15.5454 15.6431 15.5452C15.6438 15.5444 15.6445 15.5437 15.1007 15.0272C14.5569 14.5107 14.5576 14.51 14.5583 14.5093C14.5585 14.509 14.5592 14.5083 14.5596 14.5078C14.5605 14.5069 14.5614 14.506 14.5623 14.5051C14.5641 14.5033 14.5658 14.5015 14.5674 14.4998C14.5708 14.4965 14.574 14.4933 14.577 14.4904C14.583 14.4846 14.5885 14.4796 14.5933 14.4754C14.6028 14.467 14.6099 14.4616 14.6145 14.4584C14.6239 14.4517 14.6229 14.454 14.6102 14.459C14.5909 14.4666 14.5 14.4987 14.3103 14.4679C13.9077 14.4025 13.0391 14.0472 11.6069 12.5394L10.5193 13.5724ZM8.98565 3.47663C7.97206 2.04305 5.94384 1.80119 4.71766 3.09213L5.80524 4.12516C6.32808 3.57471 7.24851 3.61795 7.76086 4.3426L8.98565 3.47663ZM3.75181 6.92574C3.73038 6.52644 3.90425 6.12654 4.23564 5.77765L3.14806 4.74462C2.61221 5.30877 2.20493 6.09246 2.25397 7.00613L3.75181 6.92574ZM18.4573 19.7375C18.1783 20.0313 17.8864 20.1887 17.6026 20.2167L17.7499 21.7095C18.497 21.6357 19.1016 21.2373 19.5449 20.7705L18.4573 19.7375ZM10.0213 9.01963C10.9889 8.00095 11.0574 6.40678 10.2466 5.26012L9.02185 6.12608C9.44399 6.72315 9.37926 7.51753 8.93372 7.9866L10.0213 9.01963ZM19.5092 15.962C20.33 16.4345 20.4907 17.5968 19.8779 18.2419L20.9655 19.2749C22.2704 17.901 21.8904 15.6019 20.2575 14.662L19.5092 15.962ZM16.1 15.0642C16.4854 14.6584 17.086 14.5672 17.5987 14.8623L18.347 13.5623C17.2485 12.93 15.8861 13.1113 15.0124 14.0312L16.1 15.0642Z'
            fill='currentColor'
          />
        </svg>
      ) : (
        <svg
          width='18'
          height='18'
          viewBox='0 0 18 18'
          fill='none'
          className={className}
        >
          <path
            opacity={duotone ? '0.5' : '1'}
            d='M11.6671 10.9108L11.3255 11.2704C11.3255 11.2704 10.5136 12.1252 8.29734 9.79192C6.08109 7.45863 6.89303 6.60381 6.89303 6.60381L7.10814 6.37733C7.63805 5.81943 7.68801 4.92372 7.22568 4.26983L6.27994 2.93221C5.70771 2.12287 4.60197 2.01596 3.94609 2.70648L2.76889 3.94585C2.44367 4.28824 2.22574 4.73209 2.25217 5.22445C2.31978 6.48409 2.85804 9.19429 5.86152 12.3564C9.04661 15.7097 12.0351 15.8429 13.2572 15.7223C13.6438 15.6842 13.9799 15.4757 14.2508 15.1905L15.3163 14.0688C16.0354 13.3117 15.8327 12.0136 14.9125 11.484L13.4796 10.6592C12.8754 10.3115 12.1393 10.4136 11.6671 10.9108Z'
            fill='currentColor'
          />
          <path
            d='M9.94462 1.40987C9.99426 1.10321 10.2842 0.895175 10.5908 0.944823C10.6098 0.948457 10.6709 0.959872 10.7029 0.966999C10.7669 0.981252 10.8562 1.0032 10.9675 1.03561C11.1901 1.10045 11.501 1.20725 11.8742 1.37835C12.6214 1.72092 13.6158 2.32017 14.6476 3.35202C15.6795 4.38387 16.2787 5.37823 16.6213 6.12544C16.7924 6.49865 16.8992 6.8096 16.964 7.03219C16.9965 7.14349 17.0184 7.23276 17.0327 7.29676C17.0398 7.32876 17.045 7.35446 17.0486 7.37344L17.0529 7.39684C17.1026 7.7035 16.8965 8.00539 16.5898 8.05504C16.284 8.10455 15.9959 7.89752 15.945 7.59229C15.9435 7.5841 15.9392 7.56208 15.9346 7.54131C15.9253 7.49978 15.9093 7.43391 15.8839 7.34679C15.8332 7.17254 15.745 6.91354 15.5987 6.59428C15.3063 5.95655 14.7805 5.07591 13.8521 4.14752C12.9237 3.21912 12.0431 2.69337 11.4054 2.401C11.0861 2.25463 10.8271 2.16648 10.6529 2.11573C10.5657 2.09036 10.4563 2.06522 10.4147 2.05597C10.1095 2.00511 9.89511 1.71566 9.94462 1.40987Z'
            fill='currentColor'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M10.1143 3.99697C10.1996 3.69827 10.511 3.5253 10.8097 3.61065L10.6552 4.1515C10.8097 3.61065 10.8097 3.61065 10.8097 3.61065L10.8108 3.61096L10.8119 3.61129L10.8144 3.61202L10.8202 3.61375L10.8351 3.61838C10.8464 3.62199 10.8605 3.6267 10.8773 3.63268C10.911 3.64463 10.9555 3.66163 11.0102 3.68503C11.1194 3.73186 11.2687 3.80417 11.4521 3.91271C11.8192 4.12997 12.3203 4.49085 12.9091 5.07958C13.4978 5.66831 13.8587 6.16945 14.0759 6.53655C14.1845 6.71993 14.2568 6.86923 14.3036 6.97849C14.327 7.0331 14.344 7.07762 14.356 7.1113C14.3619 7.12814 14.3667 7.14226 14.3703 7.15357L14.3749 7.16841L14.3766 7.17422L14.3774 7.17672L14.3777 7.17787C14.3777 7.17787 14.378 7.17895 13.8371 7.33348L14.378 7.17895C14.4633 7.47766 14.2904 7.789 13.9917 7.87434C13.6955 7.95896 13.3869 7.78964 13.2985 7.4956L13.2957 7.48751C13.2917 7.47624 13.2835 7.45405 13.2696 7.42165C13.2418 7.3569 13.1915 7.25098 13.1078 7.10953C12.9406 6.82698 12.6385 6.40004 12.1136 5.87508C11.5886 5.35011 11.1617 5.04808 10.8791 4.88086C10.7377 4.79714 10.6317 4.74682 10.567 4.71907C10.5346 4.70518 10.5124 4.69691 10.5011 4.69291L10.493 4.69014C10.199 4.60173 10.0297 4.29314 10.1143 3.99697Z'
            fill='currentColor'
          />
        </svg>
      )}
    </>
  );
};

export const Money: FC<IconProps> = ({}) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10 6.875C9.38193 6.875 8.77775 7.05828 8.26384 7.40166C7.74994 7.74504 7.3494 8.2331 7.11288 8.80411C6.87635 9.37513 6.81447 10.0035 6.93505 10.6097C7.05562 11.2158 7.35325 11.7727 7.79029 12.2097C8.22733 12.6467 8.78415 12.9444 9.39034 13.065C9.99653 13.1855 10.6249 13.1236 11.1959 12.8871C11.7669 12.6506 12.255 12.2501 12.5983 11.7362C12.9417 11.2223 13.125 10.6181 13.125 10C13.125 9.1712 12.7958 8.37634 12.2097 7.79029C11.6237 7.20424 10.8288 6.875 10 6.875ZM10 11.875C9.62916 11.875 9.26665 11.765 8.95831 11.559C8.64996 11.353 8.40964 11.0601 8.26773 10.7175C8.12581 10.3749 8.08868 9.99792 8.16103 9.63421C8.23337 9.27049 8.41195 8.9364 8.67417 8.67417C8.9364 8.41195 9.27049 8.23337 9.63421 8.16103C9.99792 8.08868 10.3749 8.12581 10.7175 8.26773C11.0601 8.40964 11.353 8.64996 11.559 8.95831C11.765 9.26665 11.875 9.62916 11.875 10C11.875 10.4973 11.6775 10.9742 11.3258 11.3258C10.9742 11.6775 10.4973 11.875 10 11.875ZM18.75 4.375H1.25C1.08424 4.375 0.925268 4.44085 0.808058 4.55806C0.690848 4.67527 0.625 4.83424 0.625 5V15C0.625 15.1658 0.690848 15.3247 0.808058 15.4419C0.925268 15.5592 1.08424 15.625 1.25 15.625H18.75C18.9158 15.625 19.0747 15.5592 19.1919 15.4419C19.3092 15.3247 19.375 15.1658 19.375 15V5C19.375 4.83424 19.3092 4.67527 19.1919 4.55806C19.0747 4.44085 18.9158 4.375 18.75 4.375ZM15.1289 14.375H4.87109C4.66125 13.6653 4.27719 13.0194 3.75389 12.4961C3.23059 11.9728 2.58468 11.5887 1.875 11.3789V8.62109C2.58468 8.41125 3.23059 8.02719 3.75389 7.50389C4.27719 6.98059 4.66125 6.33468 4.87109 5.625H15.1289C15.3387 6.33468 15.7228 6.98059 16.2461 7.50389C16.7694 8.02719 17.4153 8.41125 18.125 8.62109V11.3789C17.4153 11.5887 16.7694 11.9728 16.2461 12.4961C15.7228 13.0194 15.3387 13.6653 15.1289 14.375ZM18.125 7.29453C17.3753 6.97218 16.7778 6.37466 16.4555 5.625H18.125V7.29453ZM3.54453 5.625C3.22218 6.37466 2.62466 6.97218 1.875 7.29453V5.625H3.54453ZM1.875 12.7055C2.62466 13.0278 3.22218 13.6253 3.54453 14.375H1.875V12.7055ZM16.4555 14.375C16.7778 13.6253 17.3753 13.0278 18.125 12.7055V14.375H16.4555Z'
        fill='#868C98'
      />
    </svg>
  );
};
