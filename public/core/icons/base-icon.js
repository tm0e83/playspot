import Component from '/core/component.js';
import { html } from '/core/utils/html-utils.js';

/**
 * A component that renders an SVG icon representing a key.
 */
export default class BaseIcon extends Component {
  cssFilePath = '/core/icons/base-icon.css';

  render() {
    super.render();
    this.classList.add('icon');
  }

  get template() {
    return html``;
  }
}