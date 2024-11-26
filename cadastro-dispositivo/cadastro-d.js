document.querySelector('.form-cadastro').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o envio real do formulário

    // Obtém o valor do nome do dispositivo
    const nomeDispositivo = document.getElementById('nome-dispositivo').value;

    // Verifica se o nome do dispositivo foi preenchido
    if (!nomeDispositivo) {
        alert('Por favor, preencha o nome do dispositivo.');
        return;
    }

    // Obtém o tipo de dispositivo selecionado
    const tipoDispositivo = document.querySelector('input[name="tipo"]:checked');
    if (!tipoDispositivo) {
        alert('Por favor, selecione um tipo de dispositivo.');
        return;
    }

    let idTipoDispositivo;
    switch (tipoDispositivo.value) {
        case 'pc':
            idTipoDispositivo = 1;
            break;
        case 'celular':
            idTipoDispositivo = 2;
            break;
        case 'console':
            idTipoDispositivo = 3;
            break;
        default:
            alert('Tipo de dispositivo inválido!');
            return;
    }

    // Substitua pelo ID do usuário dinâmico quando necessário
    const idUsuario = 1; // Exemplo fixo, ajuste conforme a lógica da aplicação

    // Testa se o ID do usuário é válido
    if (!idUsuario || isNaN(idUsuario)) {
        alert('ID do usuário inválido!');
        return;
    }

    const url = `http://localhost:3000/dispositivos/usuario/${idUsuario}`;

    // Corpo da requisição
    const data = {
        nome: nomeDispositivo,
        idTipoDispositivo: idTipoDispositivo,
    };

    // Exibe no console as informações que serão enviadas para o servidor
    console.log('Nome do Dispositivo:', nomeDispositivo);
    console.log('ID do Tipo de Dispositivo:', idTipoDispositivo);
    console.log('ID do Usuário:', idUsuario);
    console.log('URL da Requisição:', url);
    console.log('Dados enviados:', JSON.stringify(data));

    // Faz a requisição POST
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            console.log('Resposta do servidor:', response);

            if (!response.ok) {
                // Exibe o erro específico no console
                console.error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Exibe no console a resposta do servidor
            console.log('Resposta JSON do servidor:', data);

            // Exibe o popup ao cadastrar com sucesso
            const popup = document.getElementById('popup');
            popup.textContent = 'Dispositivo cadastrado com sucesso!';
            popup.classList.add('fade-in');
            popup.style.display = 'block';

            // Remove o popup após 3 segundos
            setTimeout(() => {
                popup.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            console.error('Erro ao cadastrar dispositivo:', error);

            // Exibe mensagem de erro no popup
            const popup = document.getElementById('popup');
            popup.textContent = 'Erro ao cadastrar dispositivo!';
            popup.classList.add('fade-in');
            popup.style.display = 'block';

            setTimeout(() => {
                popup.style.display = 'none';
            }, 3000);
        });
});
