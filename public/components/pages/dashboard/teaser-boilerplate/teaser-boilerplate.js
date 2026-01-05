import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

export default class TeaserBoilerplate extends Component {
  get template() {
    return html`
      <div class="card">
        <div class="card-body">
          <h2>${i18n.t('boilerplate')}</h2>

          <svg width="100%" height="120" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" style="border-radius: 8px; margin: 1rem 0;" preserveAspectRatio="none">
            <defs>
              <!-- Gradient für den Hintergrund -->
              <linearGradient id="placeholderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#6c5ce7;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#74b9ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00cec9;stop-opacity:1" />
              </linearGradient>

              <!-- Gradient für Elemente -->
              <linearGradient id="elementGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fdcb6e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e17055;stop-opacity:1" />
              </linearGradient>

              <!-- Glow-Effekt -->
              <filter id="placeholderGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Pattern für Hintergrund -->
              <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="0.5" fill="rgba(255,255,255,0.1)"/>
              </pattern>
            </defs>

            <!-- Hintergrund -->
            <rect width="100" height="30" fill="url(#placeholderGradient)" rx="2"/>

            <!-- Dot-Pattern -->
            <rect width="100" height="30" fill="url(#dots)"/>

            <!-- Geometrische Formen -->
            <g filter="url(#placeholderGlow)">
              <!-- Zentrale Sechseck-Form -->
              <g transform="translate(20, 15)">
                <polygon points="0,-5 4.3,-2.5 4.3,2.5 0,5 -4.3,2.5 -4.3,-2.5"
                        fill="url(#elementGradient)" opacity="0.8"/>
                <polygon points="0,-3 2.6,-1.5 2.6,1.5 0,3 -2.6,1.5 -2.6,-1.5"
                        fill="rgba(255,255,255,0.3)"/>

                <!-- Pulsierende Aura -->
                <circle r="7" fill="none" stroke="rgba(253, 203, 110, 0.4)" stroke-width="0.3">
                  <animate attributeName="r" values="7;9;7" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
                </circle>
              </g>

              <!-- Floating Squares -->
              <rect x="40" y="8" width="3" height="3" fill="url(#elementGradient)" opacity="0.7" rx="0.5">
                <animateTransform attributeName="transform" type="rotate"
                                  values="0 41.5 9.5;360 41.5 9.5" dur="8s" repeatCount="indefinite"/>
              </rect>

              <rect x="55" y="20" width="2.5" height="2.5" fill="url(#elementGradient)" opacity="0.6" rx="0.5">
                <animateTransform attributeName="transform" type="rotate"
                                  values="0 56.25 21.25;-360 56.25 21.25" dur="6s" repeatCount="indefinite"/>
              </rect>

              <!-- Triangles -->
              <polygon points="70,12 68,16 72,16" fill="url(#elementGradient)" opacity="0.5">
                <animateTransform attributeName="transform" type="scale"
                                  values="1;1.2;1" dur="4s" repeatCount="indefinite"/>
              </polygon>

              <polygon points="85,8 83,11 87,11" fill="url(#elementGradient)" opacity="0.4">
                <animateTransform attributeName="transform" type="scale"
                                  values="1;0.8;1" dur="5s" repeatCount="indefinite"/>
              </polygon>
            </g>

            <!-- Schwebende Partikel -->
            <g>
              <circle cx="30" cy="5" r="0.4" fill="#fdcb6e">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="5;3;5" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="60" cy="25" r="0.3" fill="#74b9ff">
                <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="25;27;25" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="22" r="0.5" fill="#00cec9">
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="22;20;22" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="45" cy="12" r="0.2" fill="#e17055">
                <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="12;10;12" dur="2.2s" repeatCount="indefinite"/>
              </circle>
            </g>

            <!-- Fließende Linien -->
            <g stroke="rgba(255,255,255,0.3)" stroke-width="0.3" fill="none">
              <path d="M30 15 Q50 8 70 15 Q80 18 90 12">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite"/>
              </path>
              <path d="M10 20 Q30 12 50 20 Q70 25 90 20">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite"/>
              </path>
            </g>

            <!-- Dezente Grid-Linien -->
            <g stroke="rgba(255,255,255,0.1)" stroke-width="0.1" opacity="0.5">
              <line x1="25" y1="0" x2="25" y2="30"/>
              <line x1="50" y1="0" x2="50" y2="30"/>
              <line x1="75" y1="0" x2="75" y2="30"/>
              <line x1="0" y1="10" x2="100" y2="10"/>
              <line x1="0" y1="20" x2="100" y2="20"/>
            </g>
          </svg>

          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>

          <a class="btn primary" href="/boilerplate" data-link>
            ${i18n.t('goto')}
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('teaser-boilerplate', TeaserBoilerplate);