import { i18n } from '/i18n/i18n.js';
import router from '/core/router.js';
import Component from '/core/component.js';
import '/core/icons/icon-user-plus.js';
import '/core/icons/icon-playspot.js';
import { html } from '/core/utils/html-utils.js';

// @ts-ignore
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
// @ts-ignore
import { get, getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js';
import LoadingBar from '/core/loading-bar';

export default class PageRegistration extends Component {
  cssFilePath = 'components/pages/registration/page-registration.css';

  /** @type {string} */
  #errorCode = '';

  /** @type {string} */
  #email = '';

  /** @type {string} */
  #username = '';

  constructor() {
    super();

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
  }

  addEvents() {
    this.querySelector('form')?.addEventListener('submit', this.onFormSubmit);
  }

  removeEvents() {
    this.querySelector('form')?.removeEventListener('submit', this.onFormSubmit);
  }

  /**
   * @param {Event} event
   */
  async onFormSubmit(event) {
    event.preventDefault();

    const eventTarget = /** @type {HTMLFormElement} */ (event.target);
    const db = getDatabase();

    const emailInput = /** @type {HTMLInputElement} */ (this.querySelector('input[name="email"]'))
    const usernameInput = /** @type {HTMLInputElement} */ (this.querySelector('input[name="username"]'))
    const passwordInput = /** @type {HTMLInputElement} */ (this.querySelector('input[name="password"]'))

    this.#email = emailInput.value ?? '';
    this.#username = usernameInput.value ?? '';
    const password = passwordInput.value ?? '';

    const usernameRef = ref(db, 'usernames/' + this.#username);
    const snapshot = await get(usernameRef);
    const usernameExists = snapshot.exists();

    if (!eventTarget.reportValidity()) {
      return false;
    }

    if (usernameExists) {
      this.#errorCode = 'auth/username-already-in-use';
      this.render();
      return;
    }

    LoadingBar.show();

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, this.#email, password);
      const user = userCredential.user;

      await set(ref(db, 'usernames/' + this.#username), user.uid);
      await sendEmailVerification(user);
      await auth.signOut();

      router.navigate('/verify-email');

      set(ref(db, 'users/' + user.uid), {
        balance: 1000,
        email: user.email,
        emailVerified: false,
        language: localStorage.getItem('language') || 'de',
        role: 'guest',
        uid: user.uid,
        totalWinnings: 0,
        gamesPlayed: {
          limbo: 0,
          mines: 0
        },
        username: this.#username,
        winningsHistory: []
      });

    } catch (/** @type {any} */ error) {
      this.#errorCode = error.code;
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

    switch(this.#errorCode) {
      case 'auth/email-already-in-use':
        errorText = i18n.t('emailAlreadyInUse');
        break;
      case 'auth/invalid-email':
        errorText = i18n.t('invalidEmail');
        break;
      case 'auth/weak-password':
        errorText = i18n.t('weakPassword');
        break;
      case 'auth/username-already-in-use':
        errorText = i18n.t('usernameAlreadyInUse');
        break;
      default:
        errorText = i18n.t('unknownError', { errorCode: this.#errorCode });
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
            <h1 class="mb-4 d-flex gap-4 align-items-center">
              <icon-user-plus></icon-user-plus>
              <span>${i18n.t('register')}</span>
            </h1>
          </div>
          <div class="card-body">
            ${this.#errorCode ? this.errorTemplate : ''}
            <form>
              <input
                type="email"
                name="email"
                placeholder="${i18n.t('email')}"
                autocomplete="email"
                class="form-control mb-4"
                value="${this.#email}"
                required
              >
              <input
                type="text"
                name="username"
                placeholder="${i18n.t('username')}"
                autocomplete="username"
                class="form-control mb-4"
                pattern="^[a-zA-Z0-9_\-]{3,16}$"
                value="${this.#username}"
                required
              >
              <input
                type="password"
                name="password"
                placeholder="${i18n.t('password')}"
                autocomplete="current-password"
                class="form-control mb-4"
                required
              >
              <button class="btn primary w-100" type="submit">${i18n.t('toRegister')}</button>
            </form>
            <br>
            <br>
            <div class="text-center">
              <strong>${i18n.t('alreadyRegistered')}</strong> <a href="/login" data-link>${i18n.t('loginHere')}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-registration', PageRegistration);