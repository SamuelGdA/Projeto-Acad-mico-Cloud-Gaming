document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevButton = document.querySelector('.nav.prev');
    const nextButton = document.querySelector('.nav.next');
    const leme = document.querySelector('#carrossel-leme');
    let currentIndex = 0;

    const slideWidth = slides[0].offsetWidth;

    // Organiza os slides um ao lado do outro
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    const moveToSlide = (index) => {
        track.style.transform = 'translateX(-' + slideWidth * index + 'px)';
    };

    const rotateLeme = (direction) => {
        if (direction === 'next') {
            leme.classList.remove('rotate--360');
            leme.classList.add('rotate-360');
        } else {
            leme.classList.remove('rotate-360');
            leme.classList.add('rotate--360');
        }
    };

    // Navegação para o slide anterior
    prevButton.addEventListener('click', () => {
        if (currentIndex === 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex--;
        }
        moveToSlide(currentIndex);
        rotateLeme('prev');
    });

    // Navegação para o próximo slide
    nextButton.addEventListener('click', () => {
        if (currentIndex === slides.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        moveToSlide(currentIndex);
        rotateLeme('next');
    });
});
