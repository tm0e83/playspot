import Component from '/core/component.js';
import store from '/core/store.js';
import { roundTo2Decimals } from '/core/functions.js';
import './tile-item.js';
import DatabaseAPI from '/firebase/database-api.js';
import LoadingBar from '/core/loading-bar.js';
import { html } from '/core/utils/html-utils.js';

/**
 * @typedef {Object} TileItemData
 * @property {boolean} selected
 * @property {string | null} type
 * @property {boolean} current
 */

/**
 * @typedef {(currentBalance: number|null|undefined) => number} TransactionHandler
 */

export default class PageMinesGame extends Component {
  cssFilePath = '/components/pages/games/mines/page-mines-game.css';

  /** @type {Element[]} */
  #tileItems = [];

  /** @type {TileItemData[]} */
  #tileItemsData = [];

  /** @type {boolean} */
  #gameStarted = false;

  /** @type {boolean} */
  #gameEnded = false;

  /** @type {number} */
  #stake = 0;

  /** @type {number} */
  #numMines = 8;

  /** @type {number} */
  #winAmount = 0;

  /** @type {boolean} */
  #settingsEnabled = true;

  /** @type {number} */
  totalWinFactor = 1;

  constructor() {
    super();

    this.#tileItemsData = this.newTileItemsData;

    this.onStakeInput = this.onStakeInput.bind(this);
    this.onHalveButtonClick = this.onHalveButtonClick.bind(this);
    this.onDoubleButtonClick = this.onDoubleButtonClick.bind(this);
    this.onMaxButtonClick = this.onMaxButtonClick.bind(this);
    this.onMinesInput = this.onMinesInput.bind(this);
    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onCashoutButtonClick = this.onCashoutButtonClick.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  get newTileItemsData() {
    return Array.from({ length: 25 }, () => ({ selected: false, type: null, current: false }));
  }

  disconnectedCallback() {
    this.removeEvents();

    this.innerHTML = '';
    this.stakeInput = null;
    this.halveButton = null;
    this.doubleButton = null;
    this.maxButton = null;
    this.playButton = null;
    this.cashoutButton = null;
    this.minesInput = null;
    this.#tileItems = [];
    this.#tileItemsData = [];
    this.#gameStarted = false;
    this.#gameEnded = false;
    this.#stake = 0;
    this.#numMines = 8;
    this.#winAmount = 0;
    this.#settingsEnabled = true;
    this.totalWinFactor = 1;

    super.disconnectedCallback();
  }

  addEvents() {
    this.stakeInput?.addEventListener('input', this.onStakeInput);
    this.halveButton?.addEventListener('click', this.onHalveButtonClick);
    this.doubleButton?.addEventListener('click', this.onDoubleButtonClick);
    this.maxButton?.addEventListener('click', this.onMaxButtonClick);
    this.minesInput?.addEventListener('input', this.onMinesInput);
    this.playButton?.addEventListener('click', this.onPlayButtonClick);
    this.cashoutButton?.addEventListener('click', this.onCashoutButtonClick);

    this.#tileItems.forEach(tileItem => {
      tileItem.addEventListener('selectionChange', this.onSelectionChange);
    });
  }

  removeEvents() {
    this.stakeInput?.removeEventListener('input', this.onStakeInput);
    this.halveButton?.removeEventListener('click', this.onHalveButtonClick);
    this.doubleButton?.removeEventListener('click', this.onDoubleButtonClick);
    this.maxButton?.removeEventListener('click', this.onMaxButtonClick);
    this.minesInput?.removeEventListener('input', this.onMinesInput);
    this.playButton?.removeEventListener('click', this.onPlayButtonClick);
    this.cashoutButton?.removeEventListener('click', this.onCashoutButtonClick);

    this.#tileItems.forEach(tileItem => {
      tileItem.removeEventListener('selectionChange', this.onSelectionChange);
    });
  }

  /**
   * Handles the input event on the stake input field.
   * Updates the stake value and preserves the cursor position.
   * @param {Event} event
   */
  onStakeInput(event) {
    const eventTarget = /** @type {HTMLInputElement} */ (event.target);

    if (eventTarget) {
      // Preserve the cursor position
      const selectionStart = eventTarget.selectionStart;
      const selectionEnd = eventTarget.selectionEnd;

      // Parse the input value as an integer
      this.#stake = parseInt(eventTarget.value || '0');

      // Update the stake input value
      eventTarget.value = this.#stake.toString();

      // Restore the cursor position
      eventTarget.setSelectionRange(selectionStart, selectionEnd);
    }

    this.togglePlayButton();
  }

  /**
   * Handles the click event on the halve button.
   * @param {Event} event
   */
  onHalveButtonClick(event) {
    if (this.stakeInput) {
      const stake = roundTo2Decimals(parseInt(this.stakeInput.value) / 2);
      this.stakeInput.value = stake.toString();
      this.#stake = stake;
      this.setMaxBetAmount();
      this.togglePlayButton();
    }
  }

  /**
   * Handles the click event on the double button.
   * Doubles the stake amount and updates the stake input value.
   * @param {Event} event
   */
  onDoubleButtonClick(event) {
    if (this.stakeInput) {
      const stake = parseInt(this.stakeInput.value) * 2;
      this.stakeInput.value = stake.toString();
      this.#stake = stake;
      this.setMaxBetAmount();
      this.togglePlayButton();
    }
  }

  /**
   * Handles the click event on the max button.
   * Sets the stake input value to the user's current balance.
   * @param {Event} event
   */
  onMaxButtonClick(event) {
    if (this.stakeInput) {
      const stake = store.state.user.balance;
      this.stakeInput.value = stake.toString();
      this.#stake = stake;
      this.setMaxBetAmount();
      this.togglePlayButton();
    }
  }

  /**
   * Handles the input event on the mines input field.
   * Updates the number of mines based on the input value.
   * @param {Event} event
   */
  onMinesInput(event) {
    this.#numMines = parseInt((/** @type {HTMLInputElement} */(event.target)).value);
    this.togglePlayButton();
  }

  /**
   * Handles the click event on the play button.
   * Starts the game by initializing the tile items and updating the user's balance.
   * @param {Event} event
   */
  async onPlayButtonClick(event) {
    this.#gameStarted = true;
    this.#gameEnded = false;
    this.#winAmount = 0;
    this.#tileItemsData = this.newTileItemsData;
    this.#settingsEnabled = false;
    store.dispatch('UPDATE_BALANCE', store.state.user.balance - this.#stake);

    LoadingBar.show();

    await DatabaseAPI.updateUserBalance(store.state.user.uid, (currentBalance) => {
      return (currentBalance ?? 0) - this.#stake;
    });

    await DatabaseAPI.updateStatistics(store.state.user.uid, store.state.user.username, 'mines', -1 * this.#stake);

    LoadingBar.hide();

    this.render();
  }


  /**
   * Calculates the multiplier based on number of gems found and mines on the field
   * Uses a progressive system that gives the house a statistical edge
   * @param {number} gemsFound - Number of gems the player has found
   * @param {number} totalMines - Total number of mines on the field
   * @returns {number} The multiplier for the bet
   */
  calculateMultiplier(gemsFound, totalMines) {
    if (gemsFound === 0) return 0;

    const totalTiles = 25;
    const safeTiles = totalTiles - totalMines;

    // Base multiplier calculation - probability of success
    let multiplier = 1;

    for (let i = 0; i < gemsFound; i++) {
      const remainingSafeTiles = safeTiles - i;
      const remainingTiles = totalTiles - i;
      const successProbability = remainingSafeTiles / remainingTiles;

      // Inverse of probability gives us the fair odds
      multiplier *= (1 / successProbability);
    }

    // Apply house edge (5-10% depending on risk)
    const houseEdgeBase = 0.95; // 5% house edge minimum
    const riskFactor = Math.min(totalMines / 24, 1); // More mines = slightly better odds
    const houseEdge = houseEdgeBase + (riskFactor * 0.03); // Up to 8% house edge

    multiplier *= houseEdge;

    // Progressive bonus for taking more risk (finding more gems)
    const progressiveBonus = 1 + (gemsFound - 1) * 0.02; // 2% bonus per additional gem

    multiplier *= progressiveBonus;

    // Round to 2 decimal places
    return Math.round(multiplier * 100) / 100;
  }

  /**
   * Handles the click event on the cashout button.
   * Calculates the total win factor and updates the user's balance.
   * @param {Event} event
   */
  async onCashoutButtonClick(event) {
    const gemsFound = this.numSelectedTiles;
    const multiplier = this.calculateMultiplier(gemsFound, this.#numMines);
    const totalWinAmount = Math.round(this.#stake * multiplier);

    this.#winAmount = Math.round(totalWinAmount - this.#stake);
    this.totalWinFactor = multiplier;

    store.dispatch('UPDATE_BALANCE', store.state.user.balance + totalWinAmount);

    LoadingBar.show();

    await DatabaseAPI.updateUserBalance(store.state.user.uid, (currentBalance) => {
      return (currentBalance ?? 0) + totalWinAmount;
    });

    await DatabaseAPI.updateStatistics(store.state.user.uid, store.state.user.username, 'mines', totalWinAmount);

    LoadingBar.hide();

    this.#gameStarted = false;
    this.#gameEnded = true;
    this.#settingsEnabled = true;
    this.reveal();
    this.render();
  }

  /**
   * Handles the selection change event on a tile item.
   * Updates the selected state and type of the tile item based on whether it is a mine
   * @param {Event} event
   */
  onSelectionChange(event) {
    const eventTarget = /** @type {HTMLElement} */ (event.target);
    const tileItemIndex = this.#tileItems.indexOf(eventTarget);

    this.#tileItemsData.forEach(tileItem => tileItem.current = false);

    this.#tileItemsData[tileItemIndex].selected = true;
    const isMine = this.isMine();
    this.#tileItemsData[tileItemIndex].type = isMine ? 'mine' : 'gem';
    this.#tileItemsData[tileItemIndex].current = true;

    if (isMine) {
      this.reveal();
      this.#gameStarted = false;
      this.#gameEnded = true;
    }

    this.render();
  }

  reveal() {
    this.#tileItemsData.forEach(tileItem => {
      if (!tileItem.selected) {
        tileItem.type = this.isMine() ? 'mine' : 'gem';
      }
    });
  }

  get numSelectedTiles() {
    return this.#tileItemsData.filter(tileItem => tileItem.selected).length;
  }

  /**
   * Gets the current potential multiplier if the player cashes out now
   * @returns {number} Current multiplier
   */
  get currentMultiplier() {
    if (!this.#gameStarted || this.numSelectedTiles === 0) return 1;
    return this.calculateMultiplier(this.numSelectedTiles, this.#numMines);
  }

  setMaxBetAmount() {
    this.stakeInput?.setAttribute('max', store.state.user.balance.toString());
  }

  get isValidBetAmount() {
    if (!this.stakeInput) return false;
    return parseInt(this.stakeInput.value) > 0 && parseInt(this.stakeInput.value) <= store.state.user.balance;
  }

  render() {
    super.render();

    this.stakeInput = /** @type {HTMLInputElement} */ (this.querySelector('input#stake-input'));
    this.playButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-play'));
    this.cashoutButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-cashout'));
    this.halveButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-halve'));
    this.doubleButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-double'));
    this.maxButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-max'));
    this.minesInput = /** @type {HTMLInputElement} */ (this.querySelector('input#mines-input'));
    this.#tileItems = [...this.querySelectorAll('tile-item')];

    this.addEvents();
  }

  isMine() {
    const random = Math.random();
    const numRevealedTileItems = this.#tileItemsData.filter(tileItem => !!tileItem.type).length;
    const numRevealedMines = this.#tileItemsData.filter(tileItem => tileItem.type === 'mine').length;
    const percentage = (parseInt(this.minesInput?.value || '') - numRevealedMines) / (this.#tileItems.length - (numRevealedTileItems === this.#tileItems.length ? 0 : numRevealedTileItems))

    return random <= percentage;
  }

  togglePlayButton() {
    if (this.playButton) {
      this.playButton.disabled = !this.isValidBetAmount;
    }
  }

  get template() {
    const tpl = html`
      <h1>Mines</h1>
      <div class="game-container">
        <div class="game-menu">
          <div class="settings-container">
            <div class="flex-grow-1">
              <label for="stake-input">Einsatz</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="stake-input"
                  class="form-control"
                  value="${this.#stake}"
                  ${this.#settingsEnabled ? '' : 'disabled'}
                >
                <button class="btn secondary button-halve" ${this.#settingsEnabled ? '' : 'disabled'}>&#189;</button>
                <button class="btn secondary button-double" ${this.#settingsEnabled ? '' : 'disabled'}>2&times;</button>
                <button class="btn secondary button-max" ${this.#settingsEnabled ? '' : 'disabled'}>Max</button>
              </div>
            </div>
            <div>
              <label for="mines-input">Minen</label>
              <input
                type="number"
                id="mines-input"
                class="form-control"
                value="${this.#numMines}"
                min="1"
                max="24"
                step="1"
                inputmode="numeric"
                ${this.#settingsEnabled ? '' : 'disabled'}
              >
            </div>
          </div>

          ${!this.#gameStarted ? `
            <button class="btn primary button-play" ${this.isValidBetAmount ? '' : 'disabled'}>
              Spielen
            </button>
          ` : `
            ${this.numSelectedTiles === 0 ? `
              <button class="btn primary button-select" disabled>
                Tile auswählen
              </button>
            ` : `
              <button class="btn primary button-cashout">
                Auszahlen (${this.currentMultiplier.toFixed(2)}x)
              </button>
            `}
          `}
        </div>
        <div class="game-canvas">
          <div class="tiles">
            ${this.#tileItemsData.map((itemData, index) => `
              <tile-item
                selected="${itemData.selected}"
                type="${itemData.type ? itemData.type : ''}"
                ${itemData.current ? 'animate' : ''}
                ${this.#gameStarted && !this.#gameEnded ? '' : 'disabled'}
              ></tile-item>
            `).join('')}
          </div>

          ${!this.#gameStarted && this.#gameEnded && this.#winAmount > 0 ? `
            <div class="win-message">
                <strong>${this.totalWinFactor.toFixed(2)}x</strong>
                <span>+ ${this.#winAmount} <i class="fa-solid fa-gem"></i></span>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    return tpl;
  }
}

customElements.define('page-mines-game', PageMinesGame);