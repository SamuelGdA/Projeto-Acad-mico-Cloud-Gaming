let currentSlide = 0;
let currentLemeRotation = 0;

document.getElementById('search-icon').addEventListener('click', function () {
    var searchBar = document.getElementById('search-bar'); // Obtém o elemento com o ID 'search-bar' para manipular sua exibição
    if (searchBar.style.display === "none" || searchBar.style.display === "") { // Verifica o estado atual da barra de pesquisa, se a barra de pesquisa estiver escondida ou sem estilo aplicado:
        searchBar.style.display = "block"; // Mostra a barra de pesquisa
        searchBar.focus(); // Foca automaticamente na barra de pesquisa para o usuário digitar
    } else {
        searchBar.style.display = "none";// Caso contrário, esconde a barra de pesquisa
    }
});


function moveSlide(direction) { // Função para mudar a direção do carrossel
    const slides = document.querySelectorAll('.carousel-slide'); // Seleciona todos os slides do carrossel
    const totalSlides = slides.length; // Calcula o total de slides disponíveis
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    const carousel = document.querySelector('.carousel'); // Seleciona o contêiner do carrossel
    carousel.style.transform = `translateX(${-currentSlide * 100}%)`; // Faz uma transformação para mover o carrossel para a posição correta baseado na variável atual do currentSlide

    rotateLeme(direction); // Chama a função para rotacionar o leme com a mesma direção
}

function rotateLeme(direction) { // Função para rotacionar o leme
    currentLemeRotation += direction * 90; // Ajusta a rotação do leme com base na direção fornecida
    document.getElementById('carrossel-leme').style.transform = `rotate(${currentLemeRotation}deg)`; // Aplica a transformação de rotação ao leme
}

// intervalo automático que muda o slide
setInterval(() => {
    moveSlide(1); // Move para o próximo slide pra direita
}, 8000); // Troca a cada tantos segundos
