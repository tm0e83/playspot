import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

export default class PageUser extends Component {
  cssFilePath = 'components/pages/dashboard/page-user.css';

  get template() {
    return html`
      <h1>${i18n.t('Hallöle')}</h1>
      <p>Die Benutzeraccount-Seite befindet sich noch im Aufbau.</p>
    `;
  }
}

customElements.define('page-user', PageUser);