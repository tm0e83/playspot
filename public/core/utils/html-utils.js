/**
 * Generates a cryptographically secure unique ID string for DOM attributes.
 * Uses crypto.randomUUID() if available, otherwise falls back to crypto.getRandomValues().
 * If neither is available, falls back to a less secure Math.random + timestamp combo.
 *
 * @param {string} [prefix='sym_'] - Optional prefix for the generated ID
 * @returns {string} A secure unique ID string
 */
function generateUniqueId(prefix = 'sym_') {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      return prefix + crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      let hex = '';
      for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
      }
      return prefix + hex;
    }
  }
  // Non-crypto fallback (less secure, but reduces collisions)
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
}

/**
 * Escaped HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  const escaped = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return escaped;
}

/**
 * Template function to insert unsafe HTML content.
 * Use with caution and only when you are sure the content is safe.
 * don't use this for user-generated content!
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns
 */
export function unsafeHTML(strings, ...values) {
  return new UnsafeHTML(strings, ...values);
}

/**
 * Class representing unsafe HTML content.
 * Use with caution and only when you are sure the content is safe.
 * This class is used as a marker to indicate that the content should be inserted as raw HTML.
 * don't use this for user-generated content!
 */
class UnsafeHTML {
  /**
   * @param {TemplateStringsArray} strings
   * @param  {...any} values
   */
  constructor(strings, ...values) {
    this.strings = strings;
    this.values = values;
  }
}

/**
 * Template function to safely generate HTML with placeholders for HTMLElements
 * Supports nested html calls and arrays.
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {DocumentFragment}
 */
export function html(strings, ...values) {
  /** @type {{id: string, el: HTMLElement}[]} */
  const placeholders = [];

  /**
   * Recursively process a value into a safe HTML string
   * @param {any} val
   * @returns {string}
   */
  function processValue(val) {
    if (typeof val === 'object' && val instanceof UnsafeHTML) {
      // UnsafeHTML values are inserted as raw HTML => unsafe
      const strings = /** @type {Array<string>} */ (Array.isArray(val.strings) ? val.strings : [val.strings]);
      return strings.reduce((acc, str, i) => acc + str + (val.values[i] || ''), '');
    } else if (typeof val === 'string') {
      // String values are escaped => safe
      return escapeHTML(val);
    } else if (val instanceof HTMLElement) {
      // HTMLElement values are replaced with a placeholder => safe
      const placeholderId = generateUniqueId();
      placeholders.push({ id: placeholderId, el: val });
      return `<div id="${placeholderId}"></div>`;
    } else if (val instanceof DocumentFragment) {
      // DocumentFragments (i. e. their child nodes) are processed recursively => safe since all endpoints of recursion are safe
      return Array.from(val.childNodes).map(processValue).join('');
    } else if (Array.isArray(val)) {
      // Arrays are flattened and then processed recursively => safe since all endpoints of recursion are safe
      return val.flat(Infinity).map(processValue).join('');
    } else if (val && typeof val === 'object' && val.nodeType === Node.TEXT_NODE) {
      // Text nodes are escaped => safe
      return escapeHTML(val.textContent);
    } else {
      // Other types (number, boolean, null, undefined, etc.) are converted to string and escaped => safe
      return escapeHTML(String(val));
    }
  }

  // Build the safe string with placeholders
  let result = strings[0];
  values.forEach((val, i) => {
    result += processValue(val);
    result += strings[i + 1];
  });

  // Create a template element
  const template = document.createElement('template');
  template.innerHTML = result; // ! Use of innerHTML is safe here since "result" is guaranteed to be safe (all dynamic content is escaped or replaced with placeholders)

  // Replace placeholders with actual elements
  placeholders.forEach(({ id, el }) => {
    const placeholderDiv = template.content.getElementById(id);
    if (placeholderDiv) {
      placeholderDiv.replaceWith(el);
    } else {
      console.warn(`Placeholder with id=${id} and el=${el.outerHTML} not found in template.`);
    }
  });

  return template.content; // DocumentFragment
}