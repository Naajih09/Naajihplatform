const parseNumericValue = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/)?.[0];
  if (!cleaned) {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatNaira = (value: unknown, fallback = "Not provided") => {
  const parsed = parseNumericValue(value);
  if (parsed === null) {
    return fallback;
  }

  return `NGN ${Math.round(parsed).toLocaleString()}`;
};

export const formatPercent = (value: unknown, fallback = "Not provided") => {
  const parsed = parseNumericValue(value);
  if (parsed === null) {
    return fallback;
  }

  return `${parsed.toLocaleString()}%`;
};

export const getNumericValue = (value: unknown) => parseNumericValue(value);
