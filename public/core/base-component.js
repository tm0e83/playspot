/**
 * Base class for building Web Components without Shadow DOM.
 * Handles lifecycle callbacks and rendering via a simple `render()` method.
 */
export default class BaseComponent extends HTMLElement {
  /** @type {number} */
  // static _numInstances = 0;

  /** @type {HTMLLinkElement|null} */
  // static _stylesheet;

  /** @type {string} */
  cssFilePath = '';

  /** @type {HTMLElement[]} */
  #animationElements = [];

  constructor() {
    super();

    this.render = this.render.bind(this);
  }

  /**
   * Lifecycle callback of Web Components / Custom Elements API: Called when the element is inserted into the DOM.
   * Triggers the initial render.
   * Subclasses may override this method to perform additional setup.
   */
  connectedCallback() {
    /** @type {typeof BaseComponent} */
    // (this.constructor)._numInstances++;
    this.addCSS().finally(() => this.render());
  }

  /**
   * Lifecycle callback of Web Components / Custom Elements API: Called when the elemeted is removed from the DOM.
   * Subclasses may override this method to perform cleanup.
   */
  disconnectedCallback() {
    // const ctor = /** @type {typeof BaseComponent} */ (this.constructor);
    // ctor._numInstances--;

    // if (ctor._stylesheet && !ctor._numInstances) {
      // ctor._stylesheet?.parentElement?.removeChild(ctor._stylesheet);
      // ctor._stylesheet = null;
    // }

    // Clean up any animation elements
    this.#animationElements.forEach(element => {
      if ('endElement' in element && typeof element.endElement === 'function') {
        element.endElement();
      }
    });

    this.#animationElements = [];
    this.innerHTML = '';
    this.cssFilePath = '';
  }

  /**
   * Lifecycle callback of Web Components / Custom Elements API: Called when one of the element's observed attributes is changed.
   * Subclasses should define `static get observedAttributes()` to use this.
   * @param {string} name - The name of the attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * Loads the CSS file specified by `cssFilePath` and appends it to the document head.
   * If the CSS file is already loaded, it resolves immediately.
   * @returns {Promise<void>}
   */
  addCSS() {
    const ctor = /** @type {typeof BaseComponent} */ (this.constructor);

    return new Promise((resolve, reject) => {
      if (!this.cssFilePath || document.querySelector(`#stylesheet-${ctor.name}`)) {
        resolve();
        return;
      }

      let stylesheet = document.createElement('link');
      stylesheet.setAttribute('id', `stylesheet-${ctor.name}`);
      stylesheet.setAttribute('rel', 'stylesheet');
      stylesheet.setAttribute('href', this.cssFilePath);

      /**
       * Event handler for stylesheet load.
       */
      const onLoad = () => {
        stylesheet.removeEventListener('load', onLoad);
        stylesheet.removeEventListener('error', onError);
        resolve();
      };

      /**
       * Handles CSS load error event.
       * @param {Event} error
       */
      const onError = (error /**: Event */) => {
        stylesheet.removeEventListener('load', onLoad);
        stylesheet.removeEventListener('error', onError);
        console.error(`Failed to load CSS: ${this.cssFilePath}`, error);
        reject(error);
      }

      stylesheet.addEventListener('load', onLoad);
      stylesheet.addEventListener('error', onError);

      document.head.appendChild(stylesheet);
    });
  }

  /**
   * Render the component's content. Subclasses may override this method.
   */
  render() {
    this.innerHTML = '';
    this.appendChild(this.template);
    this.#animationElements = Array.from(this.querySelectorAll('animate, animateTransform'));
  }

  /**
   * The HTML template of this component. Subclasses must override this method.
   * @returns {DocumentFragment}
   */
  get template() {
    throw new Error('This must be implemented by subclasses of Component!');
  }
}