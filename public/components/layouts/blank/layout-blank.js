import Component from '/core/component.js';
import router from '/core/router.js';
import { html } from '/core/utils/html-utils.js';
import './layout-header/layout-blank-header.js';
import '/core/background-animation.js';

export default class LayoutBlank extends Component {
  cssFilePath = '/components/layouts/blank/layout-blank.css';
  #isLoading = false;

  constructor() {
    super();

    this.render = this.render.bind(this);
  }

  disconnectedCallback() {
    router.removeEventListener('routeChange', this.render);
  }

  addEvents() {
    router.addEventListener('routeChange', this.render);
  }

  async render() {
    super.render();

    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    try {
      const { default: Page } = await import(`${router.route?.config?.component}.js`);
      this.appendChild((new Page()));
    } catch(error) {
      console.log(error);
      const { default: Page } = await import('/components/pages/404/page-404.js');
      this.appendChild((new Page()));
    }

    this.#isLoading = false;
    this.addEvents();
  }

  get template() {
    return html`
      <background-animation></background-animation>
      <layout-blank-header></layout-blank-header>
    `;
  }
}

customElements.define('layout-blank', LayoutBlank);