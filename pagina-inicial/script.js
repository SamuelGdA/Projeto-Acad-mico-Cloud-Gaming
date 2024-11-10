let currentIndex = 0;
let currentLemeRotation = 0;

// Função para mostrar o slide específico
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    const newTransform = -currentIndex * 100;
    carouselWrapper.style.transform = `translateX(${newTransform}%)`;

    updateIndicators();
}

// Função para avançar ou retroceder os slides
function moveSlide(direction) {
    showSlide(currentIndex + direction);
    rotateLeme(direction);
}

// Função para rotacionar o leme
function rotateLeme(direction) {
    currentLemeRotation += direction * 90;
    document.getElementById('carrossel-leme').style.transform = `rotate(${currentLemeRotation}deg)`;
}

// Função para atualizar os indicadores
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

// Inicializa o carrossel
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
});

// Avança os slides automaticamente a cada 8 segundos
setInterval(() => {
    moveSlide(1);
}, 8000);


// JavaScript para adicionar moedas flutuantes dinamicamente
document.addEventListener('DOMContentLoaded', () => {
    const coinContainer = document.querySelector('.floating-coins');

    // Função para criar uma moeda
    function createCoin() {
        const coin = document.createElement('div');
        coin.classList.add('coin');
        coin.style.left = Math.random() * 100 + 'vw'; // Posição horizontal aleatória
        coin.style.animationDuration = 5 + Math.random() * 5 + 's'; // Duração aleatória entre 5s e 10s
        coinContainer.appendChild(coin);

        // Remover a moeda após a animação
        setTimeout(() => {
            coin.remove();
        }, 11000); // Tempo maior que a maior duração possível da animação
    }

    // Criar moedas em intervalos regulares
    setInterval(createCoin, 500); // Cria uma moeda a cada 0.5 segundos
});

