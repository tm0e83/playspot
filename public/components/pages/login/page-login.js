import { i18n } from '/i18n/i18n.js';
import Component from '/core/component.js';
import router from '/core/router.js';
import store from '/core/store.js';
import LoadingBar from '/core/loading-bar.js';
import '/core/icons/icon-login.js';
import '/core/icons/icon-playspot.js';

// @ts-ignore
import { getAuth, signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
// @ts-ignore
import { child, get, getDatabase, off, ref, set, update } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js';
import { setCookie } from '/core/functions.js';
import { html, unsafeHTML } from '/core/utils/html-utils.js';

/**
 * @typedef {Object} AuthUser
 * @property {string} name
 * @property {*} accessToken
 * @property {boolean} emailVerified
*/

/**
 * @typedef {Object} UserCredential
 * @property {AuthUser} user
 * @property {*} accessToken
 */

export default class PageLogin extends Component {
  cssFilePath = 'components/pages/login/page-login.css';
  invalidCredentials = false;
  emailVerified = true;
  errorCode = '';

  constructor() {
    super();

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSendVerificationLinkClick = this.onSendVerificationLinkClick.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
    super.disconnectedCallback();
  }

  addEvents() {
    this.removeEvents();
    this.form?.addEventListener('submit', this.onFormSubmit);
    this.sendEmailVerificationLinkButton?.addEventListener('click', this.onSendVerificationLinkClick);
  }

  removeEvents() {
    this.form?.removeEventListener('submit', this.onFormSubmit);
    this.sendEmailVerificationLinkButton?.removeEventListener('click', this.onSendVerificationLinkClick);
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
    const password = /** @type {HTMLInputElement} */ (this.querySelector('input[name="password"]')).value ?? '';

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (/** @type {UserCredential} */ userCredential) => {
        this.errorCode = '';

        await auth.currentUser.reload();

        store.dispatch('SET_USER', {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
        });

        if (!auth.currentUser.emailVerified) {
          this.errorCode = 'auth/invalid-email-verification';
          this.render();
          LoadingBar.hide();
          return;
        }

        try {
          const dbRef = ref(getDatabase());
          const snapshot = await get(child(dbRef, `users/${auth.currentUser.uid}`));
          off(dbRef);

          if (snapshot.exists()) {
            store.dispatch('SET_USER', snapshot.val());
            router.navigate('/dashboard');
          } else {
            this.errorCode = 'auth/user-not-found';
            this.render();
          }
        } catch (/** @type {any} */ error) {
          this.errorCode = error.code;
          this.render();
        }

        LoadingBar.hide();
      })
      .catch(/** @param {{ code: string, message: string }} error */ (error) => {
        this.errorCode = error.code;
        this.render();
        LoadingBar.hide();
      });
  }

  /**
   * @param {Event} event
   */
  async onSendVerificationLinkClick(event) {
    LoadingBar.show();
    event.preventDefault();
    const auth = getAuth();
    await sendEmailVerification(auth.currentUser);
    await auth.signOut();
    LoadingBar.hide();
    router.navigate('/verify-email');
  }

  render() {
    this.removeEvents();
    super.render();

    this.form = this.querySelector('form')
    this.sendEmailVerificationLinkButton = this.querySelector('.send-verification-link');

    this.addEvents();
  }

  get errorTemplate() {
    let errorText = ''

    switch(this.errorCode) {
      case 'auth/user-not-found':
        errorText = i18n.t('userNotFound');
        break;
      case 'auth/invalid-credential':
        errorText = i18n.t('invalidCredential');
        break;
      case 'auth/invalid-email-verification':
        errorText = i18n.t('invalidEmailVerification');
        break;
      default:
        errorText = i18n.t('anErrorOccurred', { errorCode: this.errorCode });
    }

    return unsafeHTML`
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
              <icon-login></icon-login>
              <span>${i18n.t('login')}</span>
            </h1>
          </div>
          <div class="card-body">
            ${this.errorCode ? this.errorTemplate : ''}
            <form>
              <input
                type="text"
                name="email"
                placeholder="${i18n.t('email')}"
                autocomplete="email"
                class="form-control mb-4"
                required
                aria-label="${i18n.t('email')}"
              >
              <input
                type="password"
                name="password"
                placeholder="${i18n.t('password')}"
                autocomplete="current-password"
                class="form-control mb-4"
                required
                aria-label="${i18n.t('password')}"
              >
              <button class="btn primary w-100 mb-4" type="submit">${i18n.t('login')}</button>
              <br>
              <br>
              <div class="text-center">
                <a href="/reset-password" data-link>${i18n.t('passwordForgotten')}</a>
              </div>
            </form>
            <br>
            <br>
            <div class="text-center">
              <strong>${i18n.t('newHere')}</strong> <a href="/register" data-link>${i18n.t('registerNow')}</a>
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-login', PageLogin);