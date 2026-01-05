import { i18n } from '/i18n/i18n.js';
import Component from '/core/component.js';
import store from '/core/store.js';
import LoadingBar from '/core/loading-bar.js';
import DatabaseAPI from '/firebase/database-api.js';
import { html } from '/core/utils/html-utils.js';

/**
 * @typedef {(currentBalance: number|null|undefined) => number} TransactionHandler
 */

export default class PageLimboGame extends Component {
  cssFilePath = '/components/pages/games/limbo/page-limbo-game.css';

  /** @type {number} */
  #currentValue = 0;

  constructor() {
    super();

    this.onStakeInput = this.onStakeInput.bind(this);
    this.onHalveButtonClick = this.onHalveButtonClick.bind(this);
    this.onDoubleButtonClick = this.onDoubleButtonClick.bind(this);
    this.onMaxButtonClick = this.onMaxButtonClick.bind(this);
    this.onBetButtonClick = this.onBetButtonClick.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
    this.innerHTML = '';
    this.stakeInput = null;
    this.halveButton = null;
    this.doubleButton = null;
    this.maxButton = null;
    this.betButton = null;
    this.valueContainer = null;
    super.disconnectedCallback();
  }

  addEvents() {
    this.removeEvents();
    this.stakeInput?.addEventListener('input', this.onStakeInput);
    this.halveButton?.addEventListener('click', this.onHalveButtonClick);
    this.doubleButton?.addEventListener('click', this.onDoubleButtonClick);
    this.maxButton?.addEventListener('click', this.onMaxButtonClick);
    this.betButton?.addEventListener('click', this.onBetButtonClick);
  }

  removeEvents() {
    this.stakeInput?.removeEventListener('input', this.onStakeInput);
    this.halveButton?.removeEventListener('click', this.onHalveButtonClick);
    this.doubleButton?.removeEventListener('click', this.onDoubleButtonClick);
    this.maxButton?.removeEventListener('click', this.onMaxButtonClick);
    this.betButton?.removeEventListener('click', this.onBetButtonClick);
  }

  /**
   * Handles the input event on the stake input field.
   * @param {Event} event
   */
  onStakeInput(event) {
    const eventTarget = /** @type {HTMLInputElement} */ (event.target);

    if (eventTarget) {
      // Preserve the cursor position
      const selectionStart = eventTarget.selectionStart;
      const selectionEnd = eventTarget.selectionEnd;

      // Parse the input value as an integer
      const stake = parseInt(eventTarget.value || '0');

      // Update the stake input value
      eventTarget.value = stake.toString();

      // Restore the cursor position
      eventTarget.setSelectionRange(selectionStart, selectionEnd);
    }

    this.toggleBetButton();
  }

  /**
   * Handles the click event on the halve button.
   * @param {Event} event
   */
  onHalveButtonClick(event) {
    if (this.stakeInput) {
      this.stakeInput.value = Math.round(parseInt(this.stakeInput.value) / 2).toString();
    }
    this.setMaxBetAmount();
    this.toggleBetButton();
  }

  /**
   * Handles the click event on the double button.
   * @param {Event} event
   */
  onDoubleButtonClick(event) {
    if (this.stakeInput) {
      this.stakeInput.value = (parseInt(this.stakeInput.value) * 2).toString();
    }
    this.setMaxBetAmount();
    this.toggleBetButton();
  }

  /**
   * Handles the click event on the max button.
   * @param {Event} event
   */
  onMaxButtonClick(event) {
    if (this.stakeInput) {
      this.stakeInput.value = store.state.user.balance.toString();
    }
    this.setMaxBetAmount();
    this.toggleBetButton();
  }

  /**
   * Handles the click event on the bet button.
   * @param {Event} event
   */
  async onBetButtonClick(event) {
    this.#currentValue = Math.random() * 100;

    if (this.valueContainer) {
      this.valueContainer.style.left = `${this.roundedValue}%`;
      this.valueContainer.textContent = this.roundedValue.toString();
    }

    const stake = parseInt(this.stakeInput?.value ?? '0');

    if (this.#currentValue > 52) {
      this.valueContainer?.classList.add('win');
      this.valueContainer?.classList.remove('lose');
      store.dispatch('UPDATE_BALANCE', store.state.user.balance + stake);

      LoadingBar.show();

      await DatabaseAPI.updateUserBalance(store.state.user.uid, (currentBalance) => {
        return (currentBalance ?? 0) + stake;
      });

      await DatabaseAPI.updateStatistics(store.state.user.uid, store.state.user.username, 'limbo', stake);

      LoadingBar.hide();
    } else {
      this.valueContainer?.classList.add('lose');
      this.valueContainer?.classList.remove('win');
      store.dispatch('UPDATE_BALANCE', store.state.user.balance - stake);

      LoadingBar.show();

      await DatabaseAPI.updateUserBalance(store.state.user.uid, (currentBalance) => {
        return (currentBalance ?? 0) - stake;
      });

      await DatabaseAPI.updateStatistics(store.state.user.uid, store.state.user.username, 'limbo', -1 * stake);

      LoadingBar.hide();
    }

    this.setMaxBetAmount();
    this.toggleBetButton();
  }

  setMaxBetAmount() {
    this.stakeInput?.setAttribute('max', store.state.user.balance.toString());
  }

  get isValidBetAmount() {
    return parseInt(this.stakeInput?.value ?? '0') > 0 && parseInt(this.stakeInput?.value ?? '0') <= store.state.user.balance;
  }

  get roundedValue() {
    return Math.round(this.#currentValue);
  }

  render() {
    this.removeEvents();

    this.innerHTML = '';
    this.stakeInput = null;
    this.halveButton = null;
    this.doubleButton = null;
    this.maxButton = null;
    this.betButton = null;
    this.valueContainer = null;

    super.render();

    this.stakeInput = /** @type {HTMLInputElement} */ (this.querySelector('input#stake-input'));
    this.betButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-bet'));
    this.halveButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-halve'));
    this.doubleButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-double'));
    this.maxButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-max'));
    this.valueContainer = /** @type {HTMLElement} */ (this.querySelector('.value'));

    this.addEvents();
  }

  toggleBetButton() {
    if (this.betButton) {
      this.betButton.disabled = !this.isValidBetAmount;
    }
  }

  get template() {
    return html`
      <h1>Limbo</h1>
      <div class="game-container">
        <div class="history"></div>
        <div class="game-menu">
          <div>
            <label for="stake-input">Einsatz</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="stake-input"
                class="form-control"
                value="0"
              >
              <button class="btn secondary button-halve">/2</button>
              <button class="btn secondary button-double">x2</button>
              <button class="btn secondary button-max">Max</button>
            </div>
          </div>
          <button class="btn primary button-bet" ${parseInt(this.stakeInput?.value ?? '0') > 0 ? '' : 'disabled'}>${i18n.t('bet')}</button>
        </div>
        <div class="game-canvas">
          <div class="bar">
            <div class="value" style="left: ${this.roundedValue}%">${this.roundedValue}</div>
            <div class="threshold"></div>
            <div class="ruler">
              <div class="ruler-item">0</div>
              <div class="ruler-item">25</div>
              <div class="ruler-item">50</div>
              <div class="ruler-item">75</div>
              <div class="ruler-item">100</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-limbo-game', PageLimboGame);