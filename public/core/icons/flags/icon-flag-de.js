import BaseIcon from '/core/icons/base-icon.js';
import { html } from '/core/utils/html-utils.js';

/**
 * A component that renders an SVG icon representing the german flag.
 */
export default class IconFlagDE extends BaseIcon {
  get template() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
        <path fill="#fc0" d="M0 320h640v160H0z"/>
        <path fill="#000001" d="M0 0h640v160H0z"/>
        <path fill="red" d="M0 160h640v160H0z"/>
      </svg>
    `
  }
}

customElements.define('icon-flag-de', IconFlagDE);