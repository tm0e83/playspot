import { i18n } from '/i18n/i18n.js';
import Component from '/core/component.js';
import { html } from '/core/utils/html-utils.js';
import SelectDropdown from '/core/select-dropdown/select-dropdown.js';
import store from '/core/store.js';
import '/core/icons/flags/icon-flag-de.js';
import '/core/icons/flags/icon-flag-en.js';
import '/core/icons/icon-globe.js';

export default class LanguageSelection extends Component {
  cssFilePath = '/components/shared/language-selection/language-selection.css';

  constructor() {
    super();
    this.onSelect = this.onSelect.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
    this.dropdown = null;
    super.disconnectedCallback();
  }

  render() {
    super.render();
    this.dropdown = /** @type {SelectDropdown} */ (this.querySelector('select-dropdown'));
    this.addEvents();
  }

  addEvents() {
    this.removeEvents();
    this.dropdown?.addEventListener('select', this.onSelect);
  }

  removeEvents() {
    this.dropdown?.removeEventListener('select', this.onSelect);
  }

  /**
   * @param {Event} event
   */
  onSelect(event) {
    const customEvent = /** @type {CustomEvent} */ (event);
    store.dispatch('SET_LANGUAGE', customEvent.detail.value);
  }

  get template() {
    return html`
      <select-dropdown class="language-selection" open-left>
        <a class="trigger d-flex gap-2 align-items-center">
          <i class="fa-solid fa-globe"></i>
          <span>${store.state.user.language.toUpperCase()}</span>
        </a>
        <div class="dropdown">
          <div class="dropdown-content">
            <div class="no-results" style="display: none;">${i18n.t('no-results')}</div>
            <a data-value="de" ${store.state.user.language === 'de' ? 'class="selected"' : ''}>
              <icon-flag-de></icon-flag-de>
              <span>${i18n.t('german')}</span>
            </a>
            <a data-value="en" ${store.state.user.language === 'en' ? 'class="selected"' : ''}>
              <icon-flag-en></icon-flag-en>
              <span>${i18n.t('english')}</span>
            </a>
          </div>
        </div>
      </select-dropdown>
    `;
  }
}

customElements.define('language-selection', LanguageSelection);