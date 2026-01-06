import Component from '/core/component.js';
import store from '/core/store.js';
import DatabaseAPI from '/firebase/database-api.js';
import LoadingBar from '/core/loading-bar.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

export default class PageBlockfallGame extends Component {
  cssFilePath = '/components/pages/games/blockfall/page-blockfall-game.css';

  get template() {
    return html`
      <h1>Blockfall</h1>
      <p>Dieses Spiel ist derzeit in Entwicklung.</p>
    `;
  }
}

customElements.define('page-blockfall-game', PageBlockfallGame);