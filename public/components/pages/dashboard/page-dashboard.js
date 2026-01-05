import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import './teaser-boilerplate/teaser-boilerplate.js';
import './teaser-limbo/teaser-limbo.js';
import './teaser-mines/teaser-mines.js';

export default class PageDashboard extends Component {
  cssFilePath = 'components/pages/dashboard/page-dashboard.css';

  get template() {
    return html`
      <!--<h1>${i18n.t('dashboard')}</h1>-->
      <div class="d-flex gap-4 teaser-container">
        <div class="mb-4 dashboard-teaser">
          <teaser-boilerplate></teaser-boilerplate>
        </div>
        <div class="mb-4 dashboard-teaser">
          <teaser-limbo></teaser-limbo>
        </div>
        <div class="mb-4 dashboard-teaser">
          <teaser-mines></teaser-mines>
        </div>
      </div>
    `;
  }
}

customElements.define('page-dashboard', PageDashboard);