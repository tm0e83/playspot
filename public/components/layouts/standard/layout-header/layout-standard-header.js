import Component from '/core/component.js';
import store from '/core/store.js';
import { html } from '/core/utils/html-utils.js';
import '/components/shared/language-selection/language-selection.js';
import '/core/icons/icon-playspot.js';

export default class LayoutStandardHeader extends Component {
  /** @type {boolean} */
  isMenuOpen = false;
  cssFilePath = '/components/layouts/standard/layout-header/layout-standard-header.css';

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  addEvents() {
    store.unsubscribe('SET_USER', 'layoutStandardHeader');
    store.subscribe('SET_USER', this.render.bind(this), { id: 'layoutStandardHeader' });

    store.unsubscribe('UPDATE_BALANCE', 'layoutStandardHeader');
    store.subscribe('UPDATE_BALANCE', this.render.bind(this), { id: 'layoutStandardHeader' });
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

  /**
   * @returns {DocumentFragment}
   */
  get template() {
    return html`
      <header>
        <div class="header-left"><a href="/dashboard" data-link><icon-playspot></icon-playspot></a></div>
        <div class="header-center">
          <strong><i class="fa-solid fa-gem"></i> ${store.state.user.balance}</strong>
        </div>
        <div class="header-right">
          <div>
            <a href="/leaderboard" data-link>
              <i class="fa-solid fa-ranking-star"></i>
            </a>
          </div>
          <div>
            <a href="/dashboard" data-link>
              <i class="fa-solid fa-user"></i>
            </a>
          </div>
          <div>
            <language-selection></language-selection>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('layout-standard-header', LayoutStandardHeader);