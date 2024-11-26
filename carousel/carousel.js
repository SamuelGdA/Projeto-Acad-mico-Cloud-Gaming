document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.nav.prev');
    const nextButton = document.querySelector('.nav.next');
    const leme = document.querySelector('.leme img'); // Certifique-se de ter esse elemento no HTML
    let slides = [];
    let currentIndex = 0;

    /**
     * Função para buscar os jogos da API.
     * @returns {Array} Array de objetos de jogos.
     */
    const fetchJogos = async () => {
        try {
            const response = await fetch('http://localhost:3000/jogos'); // Endpoint existente
            if (!response.ok) {
                throw new Error(`Erro ao buscar jogos: ${response.status} ${response.statusText}`);
            }
            const jogos = await response.json();
            return jogos;
        } catch (error) {
            console.error(error);
            track.innerHTML = '<p>Nenhum jogo disponível no momento.</p>';
            return [];
        }
    };

    /**
     * Função para criar um cartão de jogo.
     * @param {Object} jogo - Objeto do jogo.
     * @returns {HTMLElement} - Elemento div com a estrutura do cartão.
     */
    const criarGameCard = (jogo) => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        gameCard.innerHTML = `
            <a href="jogo.html?id=${jogo.jogo_iD}">
                <img src="http://localhost:3000/midias/foto/${jogo.jogo_iD}" alt="${jogo.nome_jogo}">
            </a>
            <div class="game-info">
                <h3>${jogo.nome_jogo}</h3>
                <p>${jogo.classificacao_etaria || 'Classificação Não Informada'}</p>
            </div>
        `;
        return gameCard;
    };

    /**
     * Função para organizar jogos em slides.
     * @param {Array} jogos - Array de objetos de jogos.
     * @param {number} jogosPorSlide - Número de jogos por slide.
     * @returns {Array} - Array de elementos li representando cada slide.
     */
    const organizarSlides = (jogos, jogosPorSlide = 3) => {
        const slidesArray = [];
        for (let i = 0; i < jogos.length; i += jogosPorSlide) {
            const slide = document.createElement('li');
            slide.classList.add('carousel-slide');
            const jogosSlice = jogos.slice(i, i + jogosPorSlide);
            jogosSlice.forEach(jogo => {
                slide.appendChild(criarGameCard(jogo));
            });
            slidesArray.push(slide);
        }
        return slidesArray;
    };

    /**
     * Função para renderizar os slides no DOM.
     * @param {Array} slidesArray - Array de elementos li representando cada slide.
     */
    const renderSlides = (slidesArray) => {
        slidesArray.forEach(slide => {
            track.appendChild(slide);
        });
        slides = Array.from(track.children);
        slides.forEach((slide, index) => {
            slide.style.left = `${slide.offsetWidth * index}px`;
        });
    };

    /**
     * Função para mover para um slide específico.
     * @param {number} index - Índice do slide para mover.
     */
    const moveToSlide = (index) => {
        if (slides.length === 0) return;
        track.style.transform = `translateX(-${slides[index].style.left})`;
        currentIndex = index;
    };

    /**
     * Função para girar o leme.
     * @param {string} direction - Direção da rotação ('prev' ou 'next').
     */
    const rotateLeme = (direction) => {
        if (!leme) return;
        if (direction === 'prev') {
            leme.style.transform = 'rotate(-15deg)';
        } else if (direction === 'next') {
            leme.style.transform = 'rotate(15deg)';
        }
        setTimeout(() => {
            leme.style.transform = 'rotate(0deg)';
        }, 500); // Tempo para retornar à posição original
    };

    // Evento de navegação para o slide anterior
    prevButton.addEventListener('click', () => {
        if (currentIndex === 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex--;
        }
        moveToSlide(currentIndex);
        rotateLeme('prev');
    });

    // Evento de navegação para o próximo slide
    nextButton.addEventListener('click', () => {
        if (currentIndex === slides.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        moveToSlide(currentIndex);
        rotateLeme('next');
    });

    /**
     * Função para inicializar o carrossel.
     */
    const initCarousel = async () => {
        const jogos = await fetchJogos();
        if (jogos.length === 0) return;
        const slidesArray = organizarSlides(jogos, 3); // Ajuste o número de jogos por slide conforme necessário
        renderSlides(slidesArray);
        moveToSlide(0); // Exibe o primeiro slide
    };

    // Inicializa o carrossel ao carregar o DOM
    initCarousel();
});
