import Component from '/core/component.js';
import { html } from '/core/utils/html-utils.js';

export default class Page404 extends Component {
  constructor() {
    super();
  }

  get template() {
    return html`
      <h1>Seite nicht gefunden 8-(</h1>
    `;
  }
}

customElements.define('page-404', Page404);