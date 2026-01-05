import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
// @ts-ignore
import { getAuth, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import LoadingBar from '/core/loading-bar.js'
import { html } from '/core/utils/html-utils.js';

export default class PageVerifyEmail extends Component {
  cssFilePath = 'components/pages/verify-email/page-verify-email.css';
  emailSent = false;

  constructor() {
    super();
  }

  addEvents() {
    this.confirmLink?.addEventListener('click', this.onSendLinkButtonClick.bind(this));
  }

  /**
   * Send verification email link
   * @param {Event} event
   */
  async onSendLinkButtonClick(event) {
    event.preventDefault();
    LoadingBar.show();
    const auth = getAuth();
    const user = auth.currentUser;
    await sendEmailVerification(user);
    this.emailSent = true;
    this.render();
    LoadingBar.hide();
  }

  render() {
    super.render();
    this.confirmLink = this.querySelector('.send-confirmation-link');
    this.addEvents();
  }

  get template() {
    return html`
      <div class="max-w-sm">
        <div class="card p-4">
          <div class="card-header">
            <h1 class="mb-0">${i18n.t('verifyEmail')}</h1>
          </div>
          <div class="card-body">
            ${this.emailSent ? html`
              <p>Es wurde eine E-Mail mit einem Bestätigungslink an deine E-Mail Adresse gesendet.</p>
            ` : html`
              <p>Deine E-Mail Adresse wurde noch nicht bestätigt. Bitte folge dem Bestätigungslink, der an deine E-Mail Adresse gesendet wurde.</p>
              <a href class="send-confirmation-link btn primary">Bestätigungslink erneut senden</a>
            `}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-verify-email', PageVerifyEmail);