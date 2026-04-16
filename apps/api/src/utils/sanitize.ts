const HTML_TAG_REGEX = /<[^>]*>/g;

export function sanitizePlainText(value?: string | null) {
  if (!value) {
    return '';
  }

  return value
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0);
      return !(
        (code >= 0 && code <= 8) ||
        code === 11 ||
        code === 12 ||
        (code >= 14 && code <= 31) ||
        code === 127
      );
    })
    .join('')
    .replace(HTML_TAG_REGEX, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function sanitizeStringArray(values?: string[] | null) {
  if (!values?.length) {
    return [];
  }

  return values
    .map((value) => sanitizePlainText(value))
    .filter(Boolean)
    .slice(0, 20);
}
