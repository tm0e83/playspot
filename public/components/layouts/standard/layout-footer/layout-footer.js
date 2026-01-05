import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

export default class LayoutFooter extends Component {
  cssFilePath = '/components/layouts/standard/layout-footer/layout-footer.css';

  get template() {
    return html`
      <footer>
        <div class="d-flex gap-4 justify-content-end">
          <a href="/privacy">${i18n.t('dataProtection')}</a>
        </div>
      </footer>
    `;
  }
}

customElements.define('layout-footer', LayoutFooter);