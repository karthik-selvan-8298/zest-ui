/**
 * Material-style press ripple. Call from a pointerdown handler; the host
 * element needs the `zest-ripple-host` class (position/overflow containment).
 * The ripple span animates via .zest-ripple in base.css and removes itself.
 */
export function spawnRipple(
  host: HTMLElement,
  event: { clientX: number; clientY: number }
): void {
  const rect = host.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const span = document.createElement('span');
  span.className = 'zest-ripple';
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.left = `${event.clientX - rect.left - size / 2}px`;
  span.style.top = `${event.clientY - rect.top - size / 2}px`;
  span.addEventListener('animationend', () => span.remove());
  host.appendChild(span);
}
