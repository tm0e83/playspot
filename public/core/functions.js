import store from '/core/store.js';

/**
 * test wheather user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => !!store.state?.user?.uid;

/**
 * test wheather user is logged in and has the role "admin"
 * @returns {boolean}
 */
export const isAdmin = () => store.state.user.role === 'admin';

/**
 * test wheather user is logged in and has the role "user"
 * @returns {boolean}
 */
export const isUser = () => store.state.user.role === 'user';

/**
 * test wheather user has verified his email address
 * @returns {boolean}
 */
export const hasVerifiedEmail = () => !!store.state.user.emailVerified;

/**
 * @param {string} url
 * @returns {object}
 */
export const getQueryParams = (url = location.href) => {
  if (url.indexOf('?') == -1) return {};
  const paramArr = url.slice(url.indexOf('?') + 1).split('&');
  return paramArr.reduce((params, param) => {
    const [key, val] = param.split('=');
    const value = decodeURIComponent(val);
    params[key] = isNaN(Number(value)) || !value.length  ? value : parseFloat(value);
    return params;
  }, /** @type {Object.<string, any>} */ ({}));
}

/**
 * @param {string} dateStr
 * @param {string} languageISO
 * @returns {string}
 */
export const formatDate = (dateStr, languageISO = 'de-DE') => {
  return new Intl.DateTimeFormat(languageISO, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateStr));
}

/**
 * @param {number} value
 * @param {string} languageISO
 * @returns {string}
 */
export const formatCurrency = (value, languageISO = 'de-DE') => {
  return new Intl.NumberFormat(languageISO, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * @param {number} num
 * @returns {number}
 */
export const roundTo2Decimals = num => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Shuffle an array
 * @param {[]} arr
 * @returns array
 */
export const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * @description sets the expiring date of a cookie to Thu, 01 Jan 1970 00:00:01 GMT
 * @param {string} cookieName the name of the cookie
 */
export const expireCookie = cookieName => {
  setCookie(cookieName, '', null, -1);
};

/**
 * @description sets a cookie
 * @param {string} cookieName
 * @param {*} cookieValue
 * @param {Date | null} expireDate default is Fri, 31 Dec 9999 23:59:59
 * @param {number} expireDays expireDate must be Null in order to use this option
 */
export const setCookie = (cookieName, cookieValue = 1, expireDate = new Date('Fri, 31 Dec 9999 23:59:59'), expireDays = 0) => {
  if (expireDate === null) {
    expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (expireDays * 24 * 60 * 60 * 1000));
  }

  document.cookie = `${cookieName}=${cookieValue}; expires="${expireDate.toUTCString()}; path=/`;
};

/**
 * @description get the value of a cookie
 * @param {string} cookieName the name of the cookie
 * @returns {string|null} cookie string or null
 */
export const getCookie = cookieName => {
  let match = document.cookie.match(RegExp('(?:^|;\\s*)' + cookieName + '=([^;]*)'));
  return match ? match[1] : null;
};