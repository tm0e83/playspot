import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

export default class TeaserLimbo extends Component {
  get template() {
    return html`
      <div class="card">
        <div class="card-body">
          <h2>${i18n.t('limbo')}</h2>

          <svg width="100%" height="120" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" style="border-radius: 8px; margin: 1rem 0;" preserveAspectRatio="none">
            <defs>
              <!-- Gradient für den Hintergrund -->
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
              </linearGradient>

              <!-- Gradient für die Blitze -->
              <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffaa00;stop-opacity:1" />
              </linearGradient>

              <!-- Glow-Effekt -->
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Hintergrund -->
            <rect width="100" height="30" fill="url(#bgGradient)" rx="2"/>

            <!-- Hintergrund-Muster -->
            <g opacity="0.1">
              <circle cx="12" cy="7" r="5" fill="white"/>
              <circle cx="87" cy="22" r="4" fill="white"/>
              <circle cx="95" cy="5" r="2" fill="white"/>
            </g>

            <!-- Zentrale Energiekugel -->
            <g transform="translate(15, 15)">
              <circle r="6" fill="rgba(255,255,255,0.2)" filter="url(#glow)"/>
              <circle r="5" fill="rgba(255,255,255,0.3)"/>
              <circle r="3" fill="#ffd700" filter="url(#glow)"/>

              <!-- Pulsierende Ringe -->
              <circle r="7" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.3">
                <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>
              </circle>
            </g>

            <!-- Blitze -->
            <g filter="url(#glow)">
              <!-- Hauptblitz -->
              <path d="M35 6 L32 11 L35 11 L33 16 L36 16 L35 21 L39 14 L36 14 L40 9 Z"
                    fill="url(#lightningGradient)" opacity="0.8"/>

              <!-- Mittlerer Blitz -->
              <path d="M50 7 L48 11 L51 11 L50 15 L52 11 L51 11 L54 7 Z"
                    fill="url(#lightningGradient)" opacity="0.6"/>

              <!-- Rechter Blitz -->
              <path d="M65 10 L63 14 L66 14 L65 17 L67 14 L66 14 L69 10 Z"
                    fill="url(#lightningGradient)" opacity="0.5"/>
            </g>

            <!-- Funkelnde Partikel -->
            <g>
              <circle cx="45" cy="6" r="0.5" fill="#ffd700">
                <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/>
              </circle>
              <circle cx="60" cy="20" r="0.4" fill="#ff6b6b">
                <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="75" cy="7" r="0.3" fill="#4ecdc4">
                <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="17" r="0.4" fill="#45b7d1">
                <animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite"/>
              </circle>
            </g>

            <!-- Energielinien -->
            <g stroke="rgba(255,255,255,0.3)" stroke-width="0.3" fill="none">
              <path d="M25 15 Q50 10 75 15">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite"/>
              </path>
              <path d="M30 17 Q55 12 80 17">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite"/>
              </path>
            </g>
          </svg>

          <p>${i18n.t('limboTeaser')}</p>

          <a class="btn primary" href="/games/limbo" data-link>
            ${i18n.t('play')}
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('teaser-limbo', TeaserLimbo);