import Component from '/core/component.js';
import router from '/core/router.js';
import { html } from '/core/utils/html-utils.js';
import '/core/breadcrumbs.js';

export default class LayoutMain extends Component {
  cssFilePath = '/components/layouts/standard/layout-main/layout-main.css';
  #isLoading = false;

  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  disconnectedCallback() {
    router.removeEventListener('routeChange', this.render);
    super.disconnectedCallback();
  }

  connectedCallback() {
    router.addEventListener('routeChange', this.render);
    super.connectedCallback();
  }

  async render() {
    super.render();

    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    const { default: Page } = await import(`${router.route.config.component}.js`);
    const page = new Page();
    this.appendChild(page);
    this.#isLoading = false;
  }

  get template() {
    return html`
      <layout-breadcrumbs></layout-breadcrumbs>
    `;
  }
}

customElements.define('layout-main', LayoutMain);