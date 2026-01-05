import Component from '/core/component.js';
import store from '/core/store.js';
import { html } from '/core/utils/html-utils.js';
import '/components/shared/language-selection/language-selection.js';

export default class LayoutBlankHeader extends Component {
  /** @type {boolean} */
  isMenuOpen = false;
  cssFilePath = '/components/layouts/blank/layout-header/layout-blank-header.css';

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  addEvents() {
    store.unsubscribe('UPDATE_BALANCE', 'layoutBlankHeader');
    store.subscribe('UPDATE_BALANCE', this.render.bind(this), { id: 'layoutBlankHeader' });
  }

  wait() {
    if (this.waitTimeout) clearTimeout(this.waitTimeout);
    return new Promise((resolve, reject) => {
      this.waitTimeout = setTimeout(() => resolve(null), 100);
    });
  }

  render() {
    super.render();
    this.addEvents();
  }

  get template() {
    return html`
      <header>
        <div class="header-left"></div>
        <div class="header-right">
          <div>
            <language-selection></language-selection>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('layout-blank-header', LayoutBlankHeader);