import { gsap } from 'gsap';

export function initCursor() {
    console.log('Cursor module initialized');

    // Create inner and outer cursor elements
    const cursorEl = document.createElement('div');
    const outerEl = document.createElement('div');

    cursorEl.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: #000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transform: translate(-50%, -50%);
    `;

    outerEl.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 1px solid #000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        mix-blend-mode: difference;
        transform: translate(-50%, -50%);
    `;

    document.body.appendChild(outerEl);
    document.body.appendChild(cursorEl);

    document.addEventListener('mousemove', (e) => {
        cursorEl.style.left = e.clientX + 'px';
        cursorEl.style.top = e.clientY + 'px';
        outerEl.style.left = e.clientX + 'px';
        outerEl.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            gsap.to(cursorEl, { scale: 1, duration: 0.35 });
            gsap.to(outerEl, { scale: 0.5, duration: 0.5 });
        });

        el.addEventListener('mouseout', () => {
            gsap.to(cursorEl, { scale: 1, duration: 0.35 });
            gsap.to(outerEl, { scale: 1, duration: 0.5 });
        });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorEl.style.opacity = '0';
        outerEl.style.opacity = '0';
    });

    // Show cursor when re-entering window
    document.addEventListener('mouseenter', () => {
        cursorEl.style.opacity = '1';
        outerEl.style.opacity = '1';
    });        

    });
}
