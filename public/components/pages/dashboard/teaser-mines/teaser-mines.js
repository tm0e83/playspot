import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

export default class TeaserMines extends Component {
  get template() {
    return html`
      <div class="card">
        <div class="card-body">
          <h2>${i18n.t('mines')}</h2>

          <svg width="100%" height="120" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" style="border-radius: 8px; margin: 1rem 0;" preserveAspectRatio="none">
            <defs>
              <!-- Gradient für den Hintergrund -->
              <linearGradient id="minesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#34495e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#4a6741;stop-opacity:1" />
              </linearGradient>

              <!-- Gradient für Diamanten -->
              <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2ecc71;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#27ae60;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#16a085;stop-opacity:1" />
              </linearGradient>

              <!-- Gradient für Minen -->
              <radialGradient id="mineGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#c0392b;stop-opacity:1" />
              </radialGradient>

              <!-- Glow-Effekt -->
              <filter id="minesGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Explosion-Effekt -->
              <filter id="explosion" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Hintergrund -->
            <rect width="100" height="30" fill="url(#minesGradient)" rx="2"/>

            <!-- Grid-Muster -->
            <g opacity="0.1">
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <rect width="5" height="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.1"/>
                </pattern>
              </defs>
              <rect width="100" height="30" fill="url(#grid)"/>
            </g>

            <!-- Diamanten -->
            <g filter="url(#minesGlow)">
              <!-- Großer Diamant links -->
              <g transform="translate(15, 15)">
                <polygon points="0,-4 -3,0 0,4 3,0" fill="url(#diamondGradient)" opacity="0.9"/>
                <polygon points="0,-2 -1.5,0 0,2 1.5,0" fill="rgba(255,255,255,0.3)"/>

                <!-- Pulsierende Aura -->
                <circle r="6" fill="none" stroke="rgba(46, 204, 113, 0.4)" stroke-width="0.2">
                  <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>
                </circle>
              </g>

              <!-- Weitere Diamanten -->
              <polygon points="35,10 33,12 35,14 37,12" fill="url(#diamondGradient)" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.4;0.7" dur="1.5s" repeatCount="indefinite"/>
              </polygon>

              <polygon points="55,8 53,10 55,12 57,10" fill="url(#diamondGradient)" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.8s" repeatCount="indefinite"/>
              </polygon>

              <polygon points="75,20 73,22 75,24 77,22" fill="url(#diamondGradient)" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.2s" repeatCount="indefinite"/>
              </polygon>
            </g>

            <!-- Minen -->
            <g filter="url(#explosion)">
              <!-- Mine 1 -->
              <g transform="translate(42, 18)">
                <circle r="2" fill="url(#mineGradient)" opacity="0.8"/>
                <circle r="1.5" fill="#e74c3c"/>
                <circle r="0.8" fill="rgba(255,255,255,0.3)"/>

                <!-- Spikes -->
                <g stroke="#c0392b" stroke-width="0.3" opacity="0.6">
                  <line x1="0" y1="-3" x2="0" y2="-4"/>
                  <line x1="0" y1="3" x2="0" y2="4"/>
                  <line x1="-3" y1="0" x2="-4" y2="0"/>
                  <line x1="3" y1="0" x2="4" y2="0"/>
                  <line x1="-2" y1="-2" x2="-3" y2="-3"/>
                  <line x1="2" y1="2" x2="3" y2="3"/>
                </g>
              </g>

              <!-- Mine 2 -->
              <g transform="translate(68, 8)">
                <circle r="1.5" fill="url(#mineGradient)" opacity="0.6"/>
                <circle r="1" fill="#e74c3c"/>
                <g stroke="#c0392b" stroke-width="0.2" opacity="0.4">
                  <line x1="0" y1="-2" x2="0" y2="-3"/>
                  <line x1="0" y1="2" x2="0" y2="3"/>
                  <line x1="-2" y1="0" x2="-3" y2="0"/>
                  <line x1="2" y1="0" x2="3" y2="0"/>
                </g>
              </g>
            </g>

            <!-- Explosion-Partikel -->
            <g>
              <circle cx="25" cy="8" r="0.3" fill="#ff6b6b">
                <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="85" cy="25" r="0.4" fill="#ffa726">
                <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>
              </circle>
              <circle cx="90" cy="12" r="0.2" fill="#ff5722">
                <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite"/>
              </circle>

              <!-- Funkeln um Diamanten -->
              <circle cx="28" cy="6" r="0.2" fill="#2ecc71">
                <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="48" cy="22" r="0.3" fill="#27ae60">
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/>
              </circle>
            </g>

            <!-- Danger-Linien -->
            <g stroke="rgba(231, 76, 60, 0.3)" stroke-width="0.2" fill="none">
              <path d="M30 15 Q50 8 70 15">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite"/>
              </path>
              <path d="M35 20 Q55 12 75 20">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite"/>
              </path>
            </g>
          </svg>

          <p>Ein Spielfeld voller Felder - einige bergen wertvolle Edelsteine, andere verbergen gefährliche Minen. Setze deinen Einsatz, wähle dein Risiko, und geh aufs Ganze!</p>

          <a class="btn primary" href="/games/mines" data-link>
            ${i18n.t('play')}
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('teaser-mines', TeaserMines);