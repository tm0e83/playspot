import BaseComponent from './base-component.js';
import { html } from '/core/utils/html-utils.js';

/**
 * LoadingBar component to display a loading bar during asynchronous operations.
 */
export default class LoadingBar extends BaseComponent {
  cssFilePath = '/core/loading-bar.css';

  /** @type {number} */
  static numLoadingProcesses = 0;

  /**
   * Show the loading bar.
   * If cover is true, the loading bar will cover the entire screen.
   * @param {boolean} cover
   */
  static show(cover = false) {
    this.numLoadingProcesses++;
    const LoadingBar = /** @type {LoadingBar} */ (document.querySelector('loading-bar'));
    if (cover) LoadingBar.setAttribute('cover', '');
    LoadingBar.setAttribute('visible', '');
  }

  /**
   * Hide the loading bar.
   * This will remove the visible and cover attributes.
   */
  static hide() {
    this.numLoadingProcesses--;
    if (this.numLoadingProcesses > 0) return;
    const LoadingBar = /** @type {LoadingBar} */ (document.querySelector('loading-bar'));
    LoadingBar?.removeAttribute('visible');
    LoadingBar?.removeAttribute('cover');
  }

  get template() {
    return html`
      <div class="line"></div>
      <div class="subline inc"></div>
      <div class="subline dec"></div>
    `;
  }
}

customElements.define('loading-bar', LoadingBar);
