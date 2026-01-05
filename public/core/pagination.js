import { html } from "./utils/html-utils";

/**
 * @typedef {'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'} InsertPosition
 *
 *
/**
 * @typedef {object} PaginationArgs
 * @property {number} totalEntriesAmount
 * @property {number} entriesPerPage
 * @property {number=} currentPageIndex
 * @property {HTMLElement} container
 * @property {HTMLElement} targetContainer
 * @property {boolean} autoHide
 * @property {boolean} minimize
 * @property {string} alignment
 * @property {HTMLElement=} noResultsMessage
 * @property {InsertPosition=} insertPosition
*/

/**
 * @description Class for creating/handling paginations
 * @example
 * .no-results-message {
 *   display:none;
 * }
 *
 * <div class="example-container">
 *   <div class="no-results-message"><?php echo $this->translate('Keine Resultate'); ?></div>
 *   <div class="pagination pagination-right">
 *     <div class="page-nav">
 *       <div class="prev-page"><?php echo $this->translate('vorherige'); ?></div>
 *       <div class="page-buttons"></div>
 *       <div class="next-page"><?php echo $this->translate('nächste'); ?></div>
 *     </div>
 *   </div>
 * </div>
 *
 * new Pagination({
 *   container: document.querySelector('.pagination'),
 *   noResultsMessage: document.querySelector('.no-results-message'),
 *   totalEntriesAmount: 100,
 *   entriesPerPage: 10
 * });
 *
 * @example
 * <div class="example-container"></div>
 *
 * new Pagination({
 *   targetContainer: document.querySelector('.example-container'),
 *   totalEntriesAmount: 100,
 *   entriesPerPage: 10
 * });
 */
export default class Pagination extends EventTarget {
  /** @type {number} */
  totalEntriesAmount = 0;

  /** @type {number} */
  entriesPerPage = 0;

  /** @type {number} */
  currentPageIndex = 0;

  /** @param {PaginationArgs} args */
  constructor(args) {
    super();
    this.container = args.container;
    this.targetContainer = args.targetContainer;
    if(!this.container && !this.targetContainer) return;

    this.totalEntriesAmount = args.totalEntriesAmount || 0;
    this.entriesPerPage = args.entriesPerPage || 0;
    this.currentPageIndex = args.currentPageIndex || 0;

    this.autoHide = typeof args.autoHide !== 'undefined' ? args.autoHide : true;
    this.minimize = typeof args.minimize !== 'undefined' ? args.minimize : false;
    this.alignment = args.alignment || 'right';
    this.insertPosition = args.insertPosition || 'beforeend';

    this.pageButtonClass = 'page-button';
    this.activeClass = 'active';
    this.disabledClass = 'disabled';
    this.hideClass = 'hide';

    this.isVisible = true;

    this.onPageButtonClick = this.onPageButtonClick.bind(this);

    // if targetContainer is set, insert pagination in it
    if(this.targetContainer) {
      this.build();
    }

    this.navigation = /** @type {HTMLElement} */ (this.container.querySelector('.page-nav'));
    this.buttonPrev = /** @type {HTMLElement} */ (this.container.querySelector('.prev-page'));
    this.buttonNext = /** @type {HTMLElement} */ (this.container.querySelector('.next-page'));
    this.pageButtonContainer = /** @type {HTMLElement} */ (this.container.querySelector('.page-buttons'));
    this.noResultsMessage = /** @type {HTMLElement} */ (args.noResultsMessage || this.container.querySelector('.no-results-error'));

    this.addEvents();
    this.update(this.totalEntriesAmount, this.entriesPerPage);
    this.toggleShowHide();
  }

  build() {
    this.container = document.createElement('div');
    this.container.classList.add('pagination');
    this.container.classList.add(`pagination-${this.alignment}`);
    this.container.innerHTML = this.template;
    this.targetContainer.insertAdjacentElement(/** @type {InsertPosition} */ (this.insertPosition), this.container);
  }

  get template() {
    return /*html*/`
      <div class="page-nav">
        <div class="prev-page"><i class="fas fa-angle-left"></i></div>
        <div class="page-buttons"></div>
        <div class="next-page"><i class="fas fa-angle-right"></i></div>
      </div>
    `
  }

  addEvents() {
    this.buttonPrev?.addEventListener('click', _ => {
      const nextPageIndex = this.currentPageIndex - 1;
      if(nextPageIndex < 0 || nextPageIndex == this.currentPageIndex) return;
      this.currentPageIndex = nextPageIndex;
      this.render();
      this.dispatchEvent(new CustomEvent('pageChange', { detail: this.currentPageIndex }));
    });

    this.buttonNext?.addEventListener('click', _ => {
      const nextPageIndex = this.currentPageIndex + 1;
      if(nextPageIndex > this.numberOfPages - 1 || nextPageIndex == this.currentPageIndex) return;
      this.currentPageIndex = nextPageIndex;
      this.render();
      this.dispatchEvent(new CustomEvent('pageChange', { detail: this.currentPageIndex }));
    });
  }

  addPageButtonEvents() {
    this.pageButtons.forEach(/** @type {HTMLElement} */ (button) => {
      button?.addEventListener('click', this.onPageButtonClick);
    });
  }

  /**
   * handles click on a page button
   * @param {MouseEvent} event
   * @returns
   */
  onPageButtonClick(event) {
    const eventTarget = /** @type {HTMLElement} */ (event.target);
    event.stopPropagation();
    const nextPageIndex = parseInt(eventTarget.innerHTML) - 1;
    if(nextPageIndex == this.currentPageIndex) return;
    this.currentPageIndex = nextPageIndex;
    this.render();
    this.dispatchEvent(new CustomEvent('pageChange', { detail: this.currentPageIndex }));
  }

  /**
   * must fire render method afterwards in order to apply
   * @param {number} pageIndex
   * @returns {Pagination}
   */
  setPageIndex(pageIndex) {
    this.currentPageIndex = pageIndex !== undefined ? pageIndex : this.currentPageIndex;
    return this;
  }

  /**
   * updates the pagination view
   * @param {number} totalEntriesAmount - the total number of (filtered) entries across all pages
   * @param {number} entriesPerPage - number of entries displayed per page
   * @param {number=} pageIndex - index of the page
   */
  update(totalEntriesAmount, entriesPerPage, pageIndex) {
    this.totalEntriesAmount = totalEntriesAmount || 0;
    this.currentPageIndex = typeof pageIndex === 'number' ? pageIndex : this.currentPageIndex;

    totalEntriesAmount === 0 ? this.hidePagination() : this.showPagination();

    this.entriesPerPage = entriesPerPage || this.entriesPerPage;

    if(this.currentPageIndex >= this.numberOfPages && this.numberOfPages != 0) {
      this.currentPageIndex = this.numberOfPages - 1;
    }

    this.render();
    this.toggleShowHide();
    return this.currentPageIndex;
  }

  toggleShowHide() {
    if (this.navigation) this.navigation.style.display = this.numberOfPages > 1 ? 'flex' : 'none';
    if(!this.autoHide) return;
    this.container.style.display = this.numberOfPages > 1 ? 'flex' : 'none';
  }

  showPagination() {
    this.isVisible = true;
    if(this.noResultsMessage) this.noResultsMessage.style.display = 'none';
    if (this.navigation) this.navigation.style.display = 'flex';
  }

  hidePagination() {
    this.isVisible = false;
    if (this.navigation) this.navigation.style.display = 'none';
    if(this.noResultsMessage) this.noResultsMessage.style.display = 'block';
  }

  render() {
    let pageButtonsTemplate = '';
    let allowEllipsis = false;
    let buttonRange = this.minimize ? 0 : 1;
    this.pageButtonContainer.innerHTML = '';

    for(let i = 0; i < this.numberOfPages; i++) {
      if(i == 0 || i == this.numberOfPages - 1 || i == this.currentPageIndex - buttonRange || i == this.currentPageIndex || i == this.currentPageIndex + buttonRange) {
        pageButtonsTemplate += this.getPageButtonTemplate(i, i == this.currentPageIndex);
        allowEllipsis = true;
      } else {
        if(allowEllipsis === true) {
          pageButtonsTemplate += `<div class="page-ellipsis">&#8230;</div>`;
          allowEllipsis = false;
        }
      }
    }

    if(this.currentPageIndex === 0) {
      this.buttonPrev.classList.add(this.disabledClass);
    } else {
      this.buttonPrev.classList.remove(this.disabledClass);
    }

    if(this.currentPageIndex === this.numberOfPages - 1) {
      this.buttonNext.classList.add(this.disabledClass);
    } else {
      this.buttonNext.classList.remove(this.disabledClass);
    }

    this.pageButtonContainer.insertAdjacentHTML('beforeend', pageButtonsTemplate);
    this.addPageButtonEvents();
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }

  /**
   * @returns {number} the index of the current page
   */
  get pageIndex() {
    return this.currentPageIndex;
  }

  /**
   * returns the template for a page button
   * @param {number} index
   * @param {boolean} active
   * @returns {string}
   */
  getPageButtonTemplate(index, active) {
    return `<div class="page-button${active ? ' active' : ''}">${index + 1}</div>`;
  }

  /**
   * @returns {NodeListOf<HTMLElement> | []} the page buttons
   */
  get pageButtons() {
    return this.pageButtonContainer?.querySelectorAll('.' + this.pageButtonClass) || [];
  }

  get numberOfPages() {
    return this.totalEntriesAmount > 0 ? Math.ceil(this.totalEntriesAmount / this.entriesPerPage) : 0;
  }

  /**
   * @description returns the visible items for this pageIndex
   * @param {Array<*>} items
   * @param {number} perPage
   * @param {number} pageIndex
   */
  getVisibleItems(items, perPage = this.entriesPerPage, pageIndex = this.currentPageIndex) {
    return items.slice(pageIndex * perPage, pageIndex * perPage + perPage);
  }
}

export { Pagination };