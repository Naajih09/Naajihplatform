import type React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatNumberOptions = {
  locale?: string;
  fractionDigits?: number;
};

// Fallback to localhost if the env var isn't set, ensuring it doesn't crash
// Add this type declaration above or in a separate .d.ts file if preferred
declare global {
  interface ImportMeta {
    env: {
      VITE_API_BASE_URL?: string;
      [key: string]: any;
    };
  }
}

export const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:3000/api';

export const getApiUrl = (endpoint: string): string => {
  // Ensure we don't end up with double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export function formatNumber(number: number, opts: FormatNumberOptions = {}) {
  const { locale = 'en-NG', fractionDigits = 0 } = opts;

  return Intl.NumberFormat(locale, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(number);
}

type FormatPriceOptions = {
  locale?: string;
  currency?: string;
  fractionDigits?: number;
};

export function formatPrice(value: number, opts: FormatPriceOptions = {}) {
  const { locale = 'en-US', currency = 'NGN', fractionDigits = 0 } = opts;
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
  return formatter.format(value);
}

export function isValidNumber(n: number | string): n is number {
  return !isNaN(+n) && isFinite(+n);
}

export function getAsValidNumber(n: number | string = 0): number {
  return isValidNumber(n) ? +n : 0;
}

type ShortenNumberOptions = {
  locale?: string;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
};

export function shortenNumber(
  n: string | number,
  { locale = 'en-US', notation = 'compact', ...opts }: ShortenNumberOptions = {}
) {
  const parsedNumber = isValidNumber(n) ? +n : 0;

  // Create the options object with proper typing
  const formatOptions: Intl.NumberFormatOptions = {
    notation,
    ...opts,
  };

  return Intl.NumberFormat(locale, formatOptions).format(parsedNumber);
}

export const DEFAULT_QUERY_PAGE_SIZE = 10;

export const onNumberValidator = (
  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  onChange: (
    // eslint-disable-next-line no-unused-vars
    d: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
) => {
  const re = /^[.0-9\b]+$/;
  if (e.target.value === '' || re.test(e.target.value)) {
    onChange(e);
  }
};
