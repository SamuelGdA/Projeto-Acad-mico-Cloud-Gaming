    document.querySelector('.form-cadastro').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita o envio real do formulário

        // Mostra o pop-up com a animação
        const popup = document.getElementById('popup');
        popup.classList.add('fade-in');
        popup.style.display = 'block';

        // Remove o pop-up após 3 segundos
        setTimeout(() => {
            popup.style.display = 'none';
        }, 3000);
    });

