// Main JavaScript file
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'; // ✅ Додано розширення .js
import { initSlider } from './modules/slider.js';
import { initCursor } from './modules/cursor.js';

// Реєстрація GSAP плагінів
gsap.registerPlugin(ScrollTrigger);

class App {
    constructor() {
        this.init();
    }

    init() {
        console.log('App initialized with GSAP', gsap.version);
        
        // Ініціалізація модулів
        this.initGSAP();
        this.initSwiper();
        this.initCursor();
        
        this.bindEvents();
    }

    initGSAP() {
        console.log('GSAP initialized');
        
        // Проста GSAP анімація для тесту
        gsap.to('h1', {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power2.out"
        });

        // Ініціалізація ScrollTrigger
        ScrollTrigger.create({
            trigger: "h1",
            start: "top 80%",
            onEnter: () => console.log("Heading entered viewport")
        });
    }

    initSwiper() {
        if (document.querySelector('.swiper')) {
            this.swiper = initSlider();
            console.log('Swiper initialized');
        }
    }

    initCursor() {
        initCursor();
    }

    bindEvents() {
        console.log('Events bound');
    }
}

// Ініціалізація додатку
document.addEventListener('DOMContentLoaded', () => {
    new App();
});