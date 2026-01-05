import Component from '/core/component.js';
import { html } from '/core/utils/html-utils.js';

export default class TileItem extends Component {
  cssFilePath = '/components/pages/games/mines/tile-item.css';

  constructor() {
    super();

    this.element = /** @type {Component} */ (this);
    this.onClick = this.onClick.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
    super.disconnectedCallback();
  }

  addEvents() {
    this.removeEvents();
    this.element.addEventListener('click', this.onClick);
  }

  removeEvents() {
    this.element.removeEventListener('click', this.onClick);
  }

  /**
   * Handles the click event on the tile.
   * @param {Event} event
   */
  onClick(event) {
    if (this.hasType) return;
    this.element.dispatchEvent(new CustomEvent('selectionChange'));
  }

  get isMine() {
    return this.element.getAttribute('type') === 'mine';
  }

  get hasType() {
    return this.element.getAttribute('type') !== '';
  }

  render() {
    super.render();
    this.addEvents();
  }

  get template() {
    return this.hasType ? html`
      <i class="fa-solid ${this.isMine ? 'fa-bomb' : 'fa-gem'}"></i>
    ` : html``;
  }
}

customElements.define('tile-item', TileItem);