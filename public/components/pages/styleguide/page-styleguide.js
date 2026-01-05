import Component from '/core/component.js';
import { html } from '/core/utils/html-utils.js';

export default class PageBoilerplate extends Component {
  cssFilePath = '/components/pages/boilerplate/page-boilerplate.css';

  constructor() {
    super();
  }

  /**
   * Converts HTML tags to plain text by replacing < and > with &lt; and &gt;.
   * @param {string} htmlString
   * @returns {string} plain text from HTML string
   */
  htmlToText(htmlString) {
    htmlString = htmlString.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return htmlString;
  }

  get template() {
    return html`
      <h1 class="font-thin">Boilerplate</h1>

      <section>
        <h2>Überschriften</h2>
        <table>
          <thead>
            <th class="text-left">Headling</th>
            <th class="text-left">Example</th>
          </thead>
          <tbody>
            ${[1, 2, 3, 4, 5, 6].map(i => `
              <tr>
                <td><code>${this.htmlToText(`<h${i}></h${i}>`)}</code></td>
                <td><h${i}>h${i} Headline</h${i}></td>
              </tr>
              <tr>
                <td><code>${this.htmlToText(`<div class="h${i}"></div>`)}</code></td>
                <td><h${i}>DIV mit .h${i} Klasse</h${i}></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Buttons</h2>
        ${['primary', 'secondary', 'success', 'danger', 'warning', 'info'].map(type => `
          <tr>
            <td><code>${this.htmlToText(`<button class="btn ${type}">Button</button>`)}</code></td>
            <td><button class="btn ${type}">Button</button></td>
          </tr>
        `).join('')}
    `;
  }
}

customElements.define('page-boilerplate', PageBoilerplate);