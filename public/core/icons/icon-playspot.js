import BaseIcon from '/core/icons/base-icon.js';
import { html } from '/core/utils/html-utils.js';

/**
  * A component that renders the PlaySpot SVG icon.
 */
export default class IconPlaySpot extends BaseIcon {
  get template() {
    return html`
      <svg viewBox="0 0 95 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#4afeaf;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2dd4aa;stop-opacity:1" />
          </linearGradient>

          <!-- Glow-Effekt -->
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Gaming Controller Icon (angepasst) -->
        <g transform="translate(0, 0) scale(1.4)">
          <!-- Controller Body -->
          <rect x="3" y="6" width="20" height="12" rx="6" fill="url(#textGradient)" filter="url(#glow)"/>

          <!-- D-Pad -->
          <rect x="6" y="9" width="3" height="1" fill="white"/>
          <rect x="7.5" y="7.5" width="1" height="4" fill="white"/>

          <!-- Action Buttons -->
          <circle cx="17" cy="9" r="1.5" fill="white"/>
          <circle cx="19" cy="11" r="1.5" fill="white"/>

          <!-- Analog Sticks -->
          <circle cx="5" cy="14" r="2" fill="none" stroke="url(#textGradient)" stroke-width="1.5"/>
          <circle cx="5" cy="14" r="1" fill="url(#textGradient)"/>

          <circle cx="21" cy="14" r="2" fill="none" stroke="url(#textGradient)" stroke-width="1.5"/>
          <circle cx="21" cy="14" r="1" fill="url(#textGradient)"/>

          <!-- Gaming Accent Lines -->
          <line x1="0" y1="3" x2="6" y2="0" stroke="url(#textGradient)" stroke-width="2"/>
          <line x1="20" y1="0" x2="26" y2="3" stroke="url(#textGradient)" stroke-width="2"/>
        </g>

        <!-- Text "PlaySpot" mit Gradient -->
        <text x="45" y="15"
              font-family="Arial, sans-serif"
              font-size="18"
              font-weight="bold"
              fill="url(#textGradient)"
              filter="url(#glow)">
          Play
        </text>

        <text x="45" y="33"
              font-family="Arial, sans-serif"
              font-size="18"
              font-weight="bold"
              fill="url(#textGradient)"
              filter="url(#glow)">
          Spot
        </text>
      </svg>
    `
  }
}

customElements.define('icon-playspot', IconPlaySpot);