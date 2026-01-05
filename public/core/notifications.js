import { html } from "/core/utils/html-utils.js";

/**
 * @typedef {Object} NotificationType
 * @property {string} color - The text color.
 * @property {string} bgColor - The background color.
 * @property {string} borderColor - The border color.
 * @property {string} closerColor - The closer (close button) color.
 */

/**
 * @typedef {Object} Options
 * @property {number} [duration] - The duration of the notification.
 * @property {function} [onRemove] - The callback function to execute on remove.
 * @property {function} [onShow] - The callback function to execute on show.
 * @property {function} [onHide] - The callback function to execute on hide.
 * @property {Object.<string, NotificationType>} [types] - The notification types configuration.
 */

/**
 * @typedef {Options & {
 *   duration: number,
 *   types: Object.<string, NotificationType>
 * }} Defaults
 */

/**
 * @typedef {Defaults & {
 *  duration: number,
 * }} Settings
 */

/**
 * @typedef {Settings & {
 *  text: string,
 *  type: string,
 * }} MessageOptions
 */

class Notifications {
  /**
   * @param {Options} [options={}]
   */
  constructor(options = {}) {
    this.setConfig(options);

    this.element = document.createElement('div');
    this.element.classList.add('uic-notifications');
    document.body.insertAdjacentElement('beforeend', this.element);

    this.messages = [];
  }

  setConfig(options = {}) {
    /** @type {Defaults} */
    const defaults = {
      duration: 5000,
      types: {
        alert: {
          color: '#fff',
          bgColor: '#e74c3c',
          borderColor: 'transparent',
          closerColor: '#fff',
        },
        info: {
          color: '#fff',
          bgColor: '#057fd1',
          borderColor: 'transparent',
          closerColor: '#fff',
        },
        success: {
          color: '#fff',
          bgColor: '#27ae60',
          borderColor: 'transparent',
          closerColor: '#fff',
        },
        warning: {
          color: '#fff',
          bgColor: '#f39c12',
          borderColor: 'transparent',
          closerColor: '#fff',
        },
      },
    };

    /** @type {Settings} */
    this.settings = Object.assign({}, defaults, options);
  }

  /**
   *
   * @param {string} text
   * @param {string} [type="default"]
   * @param {Options} options
   * @returns
   */
  send(text, type = 'default', options = {}) {
    /** @type {MessageOptions} */
    const currentOptions = Object.assign({}, this.settings, options, {
      text: text,
      type: type,
    });

    let messageElement = document.createElement('div');
    this.element.insertAdjacentElement('afterbegin', messageElement);

    const notificationMessage = new NotificationMessage({
      parent: this,
      element: messageElement,
      data: currentOptions,
    });

    return notificationMessage;
  }
}

/**
 * @typedef {Object} MessageArgs
 * @property {Notifications} parent - The parent Notifications instance.
 * @property {HTMLElement} element - The notification message element.
 * @property {MessageOptions} data - The notification data.
 */

class NotificationMessage {
  /**
   * @param {MessageArgs} args
   */
  constructor(args) {
    this.parent = args.parent;
    this.element = args.element;
    this.data = args.data;

    this.defaultMessageClass = 'uic-message';
    this.messageClass = 'uic-message';
    this.closeButtonClass = 'uic-remove';
    this.fadeClass = 'uic-fade';

    this.render();
  }

  addEvents() {
    this.closer?.addEventListener('click', () => this.removeMessage());

    if (this.data.duration) {
      setTimeout(() => this.removeMessage(), this.data.duration);
    }
  }

  removeMessage() {
    this.element.classList.add(this.fadeClass);
    setTimeout(() => this.element?.parentElement?.removeChild(this.element), 400);
    if (typeof this.data.onRemove === 'function') this.data.onRemove.call(this);
  }

  get messageStyles() {
    let messageStyles = '';

    if (typeof this.data.types[this.data.type] === 'object') {
      messageStyles += `color:${this.data.types[this.data.type].color};`;
      messageStyles += `background-color:${
        this.data.types[this.data.type].bgColor
      };`;

      if (this.data.types[this.data.type].borderColor) {
        messageStyles += `border: 1px solid ${
          this.data.types[this.data.type].borderColor
        };`;
      }
    }

    return messageStyles;
  }

  get closerStyles() {
    let closerStyles = "";

    if (typeof this.data.types[this.data.type] === 'object') {
      closerStyles += `color:${this.data.types[this.data.type].closerColor};`;
    }

    return closerStyles;
  }

  render() {
    this.element.classList.add(
      this.data.type ? 'uic-' + this.data.type : this.defaultMessageClass,
      this.messageClass
    );
    this.element.setAttribute('style', this.messageStyles);
    this.element.appendChild(this.template);
    this.closer = this.element.querySelector(`.${this.closeButtonClass}`);

    this.addEvents();
  }

  get template() {
    return html`
      <div>
        ${this.data.text}
        <span class="${this.closeButtonClass}" style="${this.closerStyles}">&times;</span>
      </div>
    `;
  }
}

const notify = new Notifications();

export default notify;