// js/carousel.js
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector('.carousel-slide');
    const images = Array.from(document.querySelectorAll('.carousel-item'));
    const indicators = Array.from(document.querySelectorAll('.indicator'));
    const total = images.length;
    let index = 0;
    let intervalId = null;
    let startX = 0;
    let endX = 0;

    if (!track || total === 0) return;

    // Configuración inicial del carrusel
    function initializeCarousel() {
        track.style.display = "flex";
        images.forEach(img => {
            img.style.flex = "0 0 100%";
        });
        
        updateCarousel();
        updateIndicators();
        startAutoPlay();
    }

    function updateCarousel() {
        const slideWidth = track.clientWidth;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    function updateIndicators() {
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    window.nextSlide = function () {
        index = (index + 1) % total;
        updateCarousel();
        updateIndicators();
    };

    window.prevSlide = function () {
        index = (index - 1 + total) % total;
        updateCarousel();
        updateIndicators();
    };

    // Navegación por indicadores
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            index = parseInt(indicator.getAttribute('data-index'));
            updateCarousel();
            updateIndicators();
            resetAutoPlay();
        });
    });

    // Soporte para gestos táctiles
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Deslizamiento hacia la izquierda - siguiente
                nextSlide();
            } else {
                // Deslizamiento hacia la derecha - anterior
                prevSlide();
            }
        }
        resetAutoPlay();
    }

    function startAutoPlay() {
        stopAutoPlay();
        intervalId = setInterval(nextSlide, 5000); // 5s cada imagen
    }

    function stopAutoPlay() {
        if (intervalId) clearInterval(intervalId);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // Recalcular cuando cambia el tamaño de pantalla
    window.addEventListener("resize", updateCarousel);

    // Teclado navegación
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // Inicializar el carrusel
    initializeCarousel();
});
