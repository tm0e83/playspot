import Component from '/core/component.js';
import { hasVerifiedEmail, isLoggedIn } from '/core/functions.js';
import { i18n, initializeI18nAsync } from '/i18n/i18n.js';
import store from '/core/store.js';
import router from '/core/router.js';
import { html } from '/core/utils/html-utils.js';
import '/core/loading-bar.js';

// @ts-ignore
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import DatabaseAPI from '/firebase/database-api.js';
import LoadingBar from '/core/loading-bar.js';

class CasinoComponent extends Component {
  cssFilePath = 'components/casino-component.css';

  constructor() {
    super();

    this.render = this.render.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);
    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
  }

  connectedCallback() {
    this.init();
  }

  async init() {
    await initializeI18nAsync();
    this.addEvents();
  }

  addEvents() {
    router.addEventListener('routeChange', this.render);
    store.subscribe('SET_LANGUAGE', this.onLanguageChange, { id: 'languageSelection' });
    this.authStateChangedSubscription = getAuth().onAuthStateChanged(this.onAuthStateChanged);
  }

  removeEvents() {
    router.removeEventListener('routeChange', this.render);
    store.unsubscribe('SET_LANGUAGE', 'languageSelection');
    this.authStateChangedSubscription();
  }

  /**
   * Handles authentication state changes.
   * If the user is not authenticated, redirects to the login page.
   * @param {any} user
   * @returns
   */
  async onAuthStateChanged(user) {
    store.dispatch('SET_USER', !user ? null : {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      emailVerified: user.emailVerified,
    });

    if (!isLoggedIn()) {
      return router.navigate('/login');
    }

    const routeConfig = /** @type {import("../core/router.js").RouteConfig | null} */ (router.route.config);

    if (hasVerifiedEmail()) {
      try {
        LoadingBar.show();
        const userData = await DatabaseAPI.getUser(user.uid);
        LoadingBar.hide();

        if (userData) {
          store.dispatch('SET_USER', userData);
        }
      } catch (/** @type {any} */ error) {
        // this.errorCode = error.code;
        // this.render();
      }

      if (routeConfig?.path === 'login'
        || routeConfig?.path === 'register'
        || routeConfig?.path === 'reset-password'
        || routeConfig?.path === 'verify-email') {
        return router.navigate('/dashboard');
      }

      if (location.pathname && !routeConfig?.path) {
        return router.navigate(location.pathname);
      }

      return router.navigate(routeConfig?.path);
    }
  }

  /**
   * Handles language change event.
   * Loads the new language translations and updates the i18n instance.
   * @returns {Promise<void>}
   */
  async onLanguageChange() {
    const response = await fetch(`/i18n/locales/${store.state.user.language}.json`);
    const lang = await response.json();

    Object.entries(lang).map(([namespace, translations]) => {
      i18n.addResourceBundle(
        store.state.language,
        namespace,
        translations
      )
    });

    i18n.changeLanguage(store.state.language);
    this.layout.render();
  }

  async render() {
    const routeConfig = /** @type {import("../core/router.js").RouteConfig | null} */ (router.route.config);
    const nextLayout = routeConfig?.layout ?? 'blank'; // Default to 'blank' layout if not specified
    const layoutChanged = nextLayout !== store.state.layout;

    if (!layoutChanged) {
      return;
    }

    if (!isLoggedIn() && routeConfig?.path !== 'login') {
      console.log('User not logged in, redirecting to login page');
      return router.navigate('/login');
    }

    this.layout?.remove();
    store.state.layout = nextLayout;

    /**
     * Dynamically import the layout component based on the current layout.
     * This allows for different layouts to be used for different routes.
     */
    const { default: Layout } = await import(`/components/layouts/${store.state.layout}/layout-${store.state.layout}.js`);
    this.layout = new Layout();
    this.appendChild(this.template);
    this.appendChild(this.layout);
  }

  get template() {
    return html``;
  }
}

customElements.define('casino-component', CasinoComponent);