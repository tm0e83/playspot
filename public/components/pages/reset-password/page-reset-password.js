import { i18n } from '/i18n/i18n.js';
import router from '/core/router.js';
import Component from '/core/component.js';
import '/core/icons/icon-key.js';
import '/core/icons/icon-circle-check.js';
import '/core/icons/icon-playspot.js';
import { html } from '/core/utils/html-utils.js';

// @ts-ignore
import { getAuth, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import LoadingBar from '/core/loading-bar.js';

export default class PageResetPassword extends Component {
  cssFilePath = 'components/pages/reset-password/page-reset-password.css';

  /** @type {string} */
  errorCode = '';

  /** @type {boolean} */
  sent = false;

  constructor() {
    super();
  }

  addEvents() {
    this.querySelector('form')?.addEventListener('submit', this.onFormSubmit.bind(this));
  }

  /**
   * @param {Event} event
   */
  async onFormSubmit(event) {
    event.preventDefault();

    const eventTarget = /** @type {HTMLFormElement} */ (event.target);

    if (!eventTarget.reportValidity()) {
      return false;
    }

    LoadingBar.show();

    const email = /** @type {HTMLInputElement} */ (this.querySelector('input[name="email"]')).value ?? '';
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      this.sent = true;
      this.render();
    } catch (/** @type {any} */ error) {
      this.errorCode = error.code;
      this.render();
    }

    LoadingBar.hide();
  }

  render() {
    super.render();
    this.addEvents();
  }

  get errorTemplate() {
    let errorText = ''

    switch(this.errorCode) {
      case 'auth/user-not-found':
        errorText = i18n.t('userNotFound');
        break
      default:
        errorText = i18n.t('unknownError', { errorCode: this.errorCode });
    }

    return html`
      <div class="alert alert-danger d-flex align-items-center gap-4" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div>${errorText}</div>
      </div>
    `;
  }

  get template() {
    return html`
      <div class="max-w-sm">
        <icon-playspot></icon-playspot>
        <div class="card p-4">
          <div class="card-header">
            <h1 class="mb-0 d-flex gap-4 align-items-center">
              <icon-key></icon-key>
              <span>${i18n.t('resetPassword')}</span>
            </h1>
          </div>
          <div class="card-body">
            ${this.sent ? html`
              <p>${i18n.t('resetPasswordSent')}</p>
            ` : html`
              ${this.errorCode ? this.errorTemplate : ''}
              <form>
                <input
                  type="email"
                  name="email"
                  placeholder="${i18n.t('email')}"
                  autocomplete="email"
                  class="form-control mb-4"
                  required
                >
                <button class="btn primary w-100" type="submit">${i18n.t('resetPassword')}</button>
              </form>
            `}
            <br>
            <br>
            <div class="text-center">
              <a href="/login" data-link>${i18n.t('toLogin')}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-reset-password', PageResetPassword);