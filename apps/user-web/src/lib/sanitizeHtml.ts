const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CODE',
  'EM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HR',
  'LI',
  'OL',
  'P',
  'PRE',
  'STRONG',
  'UL',
]);

const ALLOWED_ATTRS = new Set(['href', 'target', 'rel']);

export function sanitizeHtml(html?: string | null) {
  if (!html) {
    return '';
  }

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const walk = (node: Element) => {
    const children = Array.from(node.children);

    for (const child of children) {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        continue;
      }

      for (const attr of Array.from(child.attributes)) {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.trim();

        if (!ALLOWED_ATTRS.has(attr.name)) {
          child.removeAttribute(attr.name);
          continue;
        }

        if (
          (attrName === 'href' || attrName === 'src') &&
          /^(javascript:|data:text\/html)/i.test(attrValue)
        ) {
          child.removeAttribute(attr.name);
        }
      }

      if (child.tagName === 'A') {
        child.setAttribute('rel', 'noopener noreferrer');
        if (!child.getAttribute('target')) {
          child.setAttribute('target', '_blank');
        }
      }

      walk(child);
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
}
