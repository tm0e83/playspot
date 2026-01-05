import Component from '/core/component.js';
import DatabaseAPI from '/firebase/database-api.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

/** @typedef {object} LeaderboardEntry
 * @property {string} uid
 * @property {string} username
 * @property {number} score
 */

export default class PageLeaderboard extends Component {
  cssFilePath = 'components/pages/leaderboard/page-leaderboard.css';

  /** @type {Array<LeaderboardEntry>} */
  globalEntries = [];

  /** @type {Array<LeaderboardEntry>} */
  limboEntries = [];

  /** @type {Array<LeaderboardEntry>} */
  minesEntries = [];

  async connectedCallback() {
    /** @type {Array<{uid: string, username: string, score: number}>} */

    Promise.all([
      DatabaseAPI.getLeaderboardEntries('alltime', 'global'),
      DatabaseAPI.getLeaderboardEntries('alltime', 'limbo'), // Beispiel für ein spezifisches Spiel
      DatabaseAPI.getLeaderboardEntries('alltime', 'mines')  // Beispiel für ein anderes Spiel
    ]).then(([globalEntries, limboEntries, minesEntries]) => {
      this.globalEntries = globalEntries;
      this.limboEntries = limboEntries;
      this.minesEntries = minesEntries;
      this.render();
    }).catch(error => {
      console.error('Fehler beim Abrufen der Leaderboard-Daten:', error);
      this.globalEntries = [];
      this.limboEntries = [];
      this.minesEntries = [];
    });

    this.leaderboardData = await DatabaseAPI.getLeaderboardEntries();
    super.connectedCallback();
    this.render();
  }

  get template() {
    return html`
      <h1>${i18n.t('Leaderboard')}</h1>

      <div class="leaderboards">
        <div class="leaderboard card p-4">
          <div class="card-header">
            <h2 class="mb-0 d-flex gap-4 align-items-center">
              <span>${i18n.t('alltime')} - ${i18n.t('allGames')}</span>
            </h2>
          </div>
          <div class="card-body">
            ${this.globalEntries?.map(entry => html`
              <div class="leaderboard-entry">
                <div><i class="fa-solid fa-trophy"></i></div>
                <div class="username">${entry.username}</div>
                <div class="score">${entry.score}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="leaderboard card p-4">
          <div class="card-header">
            <h2 class="mb-0 d-flex gap-4 align-items-center">
              <span>${i18n.t('alltime')} - ${i18n.t('limbo')}</span>
            </h2>
          </div>
          <div class="card-body">
            ${this.limboEntries?.map(entry => html`
              <div class="leaderboard-entry">
                <div><i class="fa-solid fa-trophy"></i></div>
                <div class="username">${entry.username}</div>
                <div class="score">${entry.score}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="leaderboard card p-4">
          <div class="card-header">
            <h2 class="mb-0 d-flex gap-4 align-items-center">
              <span>${i18n.t('alltime')} - ${i18n.t('mines')}</span>
            </h2>
          </div>
          <div class="card-body">
            ${this.minesEntries?.map(entry => html`
              <div class="leaderboard-entry">
                <div><i class="fa-solid fa-trophy"></i></div>
                <div class="username">${entry.username}</div>
                <div class="score">${entry.score}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-leaderboard', PageLeaderboard);