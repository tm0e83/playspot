import { i18n } from '/i18n/i18n.js';
import Component from '/core/component.js';
import router from '/core/router.js';
import { html } from '/core/utils/html-utils.js';

export default class BreadcrumbsComponent extends Component {
  constructor() {
    super();
  }

  /**
   * @returns {array}
   */
  get breadcrumbItems() {
    return router.routeHierarchy.reduce((items, item) => {
      item.fullpath = item.path;
      Object.entries(router.route.queryParams).map(([paramName, paramValue]) => {
        item.fullpath = item.path.replace(`:${paramName}`, paramValue);
        return item;
      });
      items.push(item);
      return items;
    }, []);
  }

  render() {
    this.innerHTML = '';
    const breadcrumbItems = this.breadcrumbItems;
    if (breadcrumbItems.length < 2) return;
    this.appendChild(this.template);
    const list = this.querySelector('ol')
    breadcrumbItems.map(item => list.appendChild((new BreadcrumbItem(item)).element));
  }

  get template() {
    return html`
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb"></ol>
      </nav>
    `;
  }
}

customElements.define('breadcrumbs-component', BreadcrumbsComponent);

class BreadcrumbItem {
  constructor(data) {
    this.data = data;

    this.render();
  }

  render() {
    this.element = document.createElement('li');
    this.element.classList.add('breadcrumb-item');
    this.element.appendChild(this.template);
  }

  get template() {
    if (this.data.path === router.route.config.path) {
      return i18n.t(this.data.title);
    }

    return html`<a href="/${this.data.fullpath}">${i18n.t(this.data.title)}</a>`;
  }
}