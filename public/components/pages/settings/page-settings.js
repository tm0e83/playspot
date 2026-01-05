import Component from '/core/component.js';
import LoadingBar from '/core/loading-bar.js';
import store from '/core/store.js';
import DatabaseAPI from '/firebase/database-api.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

/**
 * @typedef {(currentBalance: number|null|undefined) => number} TransactionHandler
 */

export default class PageSettings extends Component {
  constructor() {
    super();

    this.onSettingsSave = this.onSettingsSave.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
    this.saveButton = null;
    this.languageSelect = null;
    this.balanceInput = null;
  }

  addEvents() {
    this.saveButton?.addEventListener('click', this.onSettingsSave);
  }

  removeEvents() {
    this.saveButton?.removeEventListener('click', this.onSettingsSave);
  }

  /**
   * Handles the save button click event.
   * Updates the user settings in the store and Firebase.
   * @param {Event} event
   */
  async onSettingsSave(event) {
    LoadingBar.show();

    if (this.languageSelect) {
      store.dispatch('SET_LANGUAGE', this.languageSelect.value);
      await DatabaseAPI.updateUserSettings(store.state.user.uid, { language: this.languageSelect.value });
    }

    if (this.balanceInput) {
      store.dispatch('UPDATE_BALANCE', parseInt(this.balanceInput?.value ?? '0'));
      await DatabaseAPI.updateUserBalance(
        store.state.user.uid,
        () => parseInt(this.balanceInput?.value ?? '0') || 0
      );
    }

    LoadingBar.hide();
  }

  render() {
    super.render();

    this.saveButton = this.querySelector('button');
    this.languageSelect = this.querySelector('select');
    this.balanceInput = this.querySelector('input');

    this.addEvents();
  }

  get template() {
    return html`
      <h1>${i18n.t('settings')}</h1>
      <div class="card">
        <div class="card-body max-w-sm">
          <div class="mb-4">
            <label for="language">${i18n.t('language')}</label>
            <select id="language" class="mb-4">
              <option value="de" ${store.state.user.language == 'de' ? 'selected' : ''}>
                ${i18n.t('german')}
              </option>
              <option value="en" ${store.state.user.language == 'en' ? 'selected' : ''}>
                ${i18n.t('english')}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="language">${i18n.t('balance')}</label>
            <input
              type="number"
              id="balance"
              class="mb-4"
              min="0"
              max="1000"
              step="0.01"
              value="${store.state.user.balance}"
            >
          </div>
          <button class="btn primary">${i18n.t('save')}</button>
        </div>
      </div>
    `;
  }
}

customElements.define('page-settings', PageSettings);