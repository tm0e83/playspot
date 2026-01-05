import Component from '/core/component.js';
import { html } from '/core/utils/html-utils.js';
import './layout-sidebar/layout-sidebar.js';
import './layout-header/layout-standard-header.js';
import './layout-main/layout-main.js';
import './layout-footer/layout-footer.js';

export default class LayoutStandard extends Component {
  cssFilePath = '/components/layouts/standard/layout-standard.css';

  get template() {
    return html`
      <layout-sidebar></layout-sidebar>
      <div class="lower-layout">
        <layout-standard-header></layout-standard-header>
        <div class="inner-layout">
          <layout-main></layout-main>
          <layout-footer></layout-footer>
        </div>
      </div>
    `;
  }
}

customElements.define('layout-standard', LayoutStandard);