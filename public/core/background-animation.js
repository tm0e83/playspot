import Component from '/core/component.js';
import { html } from '/core/utils/html-utils.js';

/**
 * Background animation component that creates a polygon network animation
 * on a canvas element. The animation consists of points that move around
 */
export default class BackgroundAnimation extends Component {
  cssFilePath = '/core/background-animation.css';

  constructor() {
    super();
    this.startAnimation = this.startAnimation.bind(this);
  }

  disconnectedCallback() {
    this.removeEvents();
    super.disconnectedCallback();
  }

  addEvents() {
    window.addEventListener('resize', this.startAnimation);
  }

  removeEvents() {
    window.removeEventListener('resize', this.startAnimation);
  }

  render() {
    super.render();
    this.addEvents();
    this.startAnimation();
  }

  startAnimation() {
    const canvas = /** @type {HTMLCanvasElement} */ (this.querySelector('canvas'));

    if (!canvas) {
      console.error('Canvas element not found in the page.');
      return;
    }

    const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    let w = 0, h = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Polygon network animation
    const points = /** @type {Point[]} */ ([]);
    const maxDistance = 150;
    const pointCount = 80;

    class Point {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Check boundaries and bounce
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Keep points within the visible area
        this.x = Math.max(0, Math.min(w, this.x));
        this.y = Math.max(0, Math.min(h, this.y));
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 254, 175, 0.6)';
        ctx.fill();
      }
    }

    // Create points
    for (let i = 0; i < pointCount; i++) {
      points.push(new Point());
    }

    function drawConnections() {
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const point1 = points[i];
          const point2 = points[j];

          const distance = Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2)
          );

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.strokeStyle = `rgba(74, 254, 175, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, w, h);

      // Draw connections
      drawConnections();

      // Update and draw points
      points.forEach(point => {
        point.update();
        point.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  get template() {
    return html`
      <canvas id="bg"></canvas>
    `;
  }
}

customElements.define('background-animation', BackgroundAnimation);