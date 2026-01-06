import Component from '/core/component.js';
import store from '/core/store.js';
import { html } from '/core/utils/html-utils.js';
import '/components/shared/language-selection/language-selection.js';
import '/core/icons/icon-playspot.js';
import { i18n } from '/i18n/i18n.js';

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
          <span>${i18n.t('balance')}:&nbsp;</span>
          <strong><i class="fa-solid fa-gem"></i> ${store.state.user.balance}</strong>
        </div>
        <div class="header-right">
          <div>
            <a href="/leaderboard" data-link>
              <i class="fa-solid fa-ranking-star"></i>
            </a>
          </div>
          <div>
            <a href="/account" data-link>
              <i class="fa-solid fa-user"></i>
            </a>
          </div>
          <div>
            <language-selection></language-selection>
          </div>
          <div>
            <a href="https://github.com/tm0e83/playspot" title="${i18n.t('showOnGithub')}" target="_blank">
              <img
                src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3E%3Cpath%20fill='%23ffffff'%20d='M12%200c-6.626%200-12%205.373-12%2012%200%205.302%203.438%209.8%208.207%2011.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729%201.205.084%201.839%201.237%201.839%201.237%201.07%201.834%202.807%201.304%203.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931%200-1.311.469-2.381%201.236-3.221-.124-.303-.535-1.524.117-3.176%200%200%201.008-.322%203.301%201.23.957-.266%201.983-.399%203.003-.404%201.02.005%202.047.138%203.006.404%202.291-1.552%203.297-1.23%203.297-1.23.653%201.653.242%202.874.118%203.176.77.84%201.235%201.911%201.235%203.221%200%204.609-2.807%205.624-5.479%205.921.43.372.823%201.102.823%202.222v3.293c0%20.319.192.694.801.576%204.765-1.589%208.199-6.086%208.199-11.386%200-6.627-5.373-12-12-12z'/%3E%3C/svg%3E"
                alt="Github Logo"
              >
            </a>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('layout-standard-header', LayoutStandardHeader);