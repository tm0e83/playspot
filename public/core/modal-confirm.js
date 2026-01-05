import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

/** @typedef {Object} ModalConfirmOptions
 * @property {string} title - The title of the modal.
 * @property {string} message - The message body of the modal.
 * @property {string} buttonConfirmLabel - The label for the confirm button.
 * @property {string} buttonCancelLabel - The label for the cancel button.
 * @property {string} buttonConfirmClass - The CSS class for the confirm button.
 * @property {string} buttonCancelClass - The CSS class for the cancel button.
 * @property {Function} onConfirm - Callback function to execute on confirm.
 * @property {Function} onCancel - Callback function to execute on cancel.
 */

export default class ModalConfirm {
  /** @type {HTMLElement | null} */
  static element = null;

  /** @type {any} */
  static modal = null;

  /** @type {ModalConfirmOptions} */
  static defaults = {
    title: '',
    message: '',
    buttonConfirmLabel: i18n.t('OK'),
    buttonCancelLabel: i18n.t('Abbrechen'),
    buttonConfirmClass: 'btn-danger',
    buttonCancelClass: 'btn-secondary',
    onConfirm: function() {},
    onCancel: function() {},
  }

    /** @type {ModalConfirmOptions} */
  static settings = ModalConfirm.defaults;

  /**
   * Show the modal confirmation dialog.
   * @param {ModalConfirmOptions} args
   */
  static show(args) {
    ModalConfirm.settings = Object.assign(ModalConfirm.defaults, args);

    ModalConfirm.element = document.createElement('div');
    if (!ModalConfirm.element) return;
    ModalConfirm.element.classList.add('modal', 'fade');
    ModalConfirm.element.appendChild(ModalConfirm.template);

    document.body.appendChild(ModalConfirm.element);

    ModalConfirm.element.querySelector('.button-confirm')?.addEventListener('click', (event) => {
      ModalConfirm.settings.onConfirm();
      ModalConfirm.hide();
    });
    ModalConfirm.element.querySelector('.button-cancel')?.addEventListener('click', (event) => {
      ModalConfirm.settings.onCancel();
      ModalConfirm.hide();
    });

    // @ts-ignore
    ModalConfirm.modal = new bootstrap.Modal(ModalConfirm.element);

    if (ModalConfirm?.modal) {
      ModalConfirm.modal.show();
    }
  }

  static hide() {
    ModalConfirm.modal.hide();
  }

  static get template() {
    return html`
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">${ModalConfirm.settings.title}</h5>
          </div>
          <div class="modal-body">
            <p>${ModalConfirm.settings.message}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn button-cancel ${ModalConfirm.settings.buttonCancelClass}"
              data-bs-dismiss="modal"
            >${ModalConfirm.settings.buttonCancelLabel}</button>
            <button
              type="button"
              class="btn button-confirm ${ModalConfirm.settings.buttonConfirmClass}"
            >${ModalConfirm.settings.buttonConfirmLabel}</button>
          </div>
        </div>
      </div>
    `;
  }
}