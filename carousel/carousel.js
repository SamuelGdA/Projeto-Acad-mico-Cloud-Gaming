document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevButton = document.querySelector('.nav.prev');
    const nextButton = document.querySelector('.nav.next');

    const slideWidth = slides[0].offsetWidth;

    // Organiza os slides um ao lado do outro
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    let currentIndex = 0;

    const moveToSlide = (index) => {
        track.style.transform = 'translateX(-' + slideWidth * index + 'px)';
    };

    // Navegação para o slide anterior
    prevButton.addEventListener('click', () => {
        if (currentIndex === 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex--;
        }
        moveToSlide(currentIndex);
    });

    // Navegação para o próximo slide
    nextButton.addEventListener('click', () => {
        if (currentIndex === slides.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        moveToSlide(currentIndex);
    });
});
