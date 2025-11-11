// Slider module
import Swiper from 'swiper/bundle';

export function initSlider() {
    console.log('Slider module initialized');
    
    // Ініціалізація Swiper
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });

    return swiper;
}