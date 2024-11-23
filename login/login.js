// Selecionando elementos do DOM
const form = document.getElementById('formLogin');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const popupTitle = document.getElementById('popupTitle');
const popupMessage = document.getElementById('popupMessage');

// Evento de fechamento do popup
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Fecha o pop-up ao clicar fora dele
window.addEventListener('click', function(event) {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});

// Evento de submissão do formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o comportamento padrão do formulário

  // Capturando os valores dos campos
  const identificador = document.getElementById('identificador').value;
  const senha = document.getElementById('senhaLogin').value;

  // Expressões regulares para validação
  const identificadorRegex = /^[^\s@]+$/; // Ajuste conforme necessário
  const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;

  let mensagemErro = '';

  // Validação do identificador
  if (!identificadorRegex.test(identificador)) {
    mensagemErro += '• O nome de usuário não deve conter espaços ou caracteres inválidos.<br>';
  }

  // Validação da senha
  if (!senhaRegex.test(senha)) {
    mensagemErro += '• A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula e um caractere especial.<br>';
  }

  // Verifica se há erros de validação
  if (mensagemErro) {
    // Exibe o pop-up de erro
    popupTitle.textContent = 'Erro no Login';
    popupMessage.innerHTML = mensagemErro;
    popup.style.display = 'block';
    return; // Interrompe o processamento para não enviar os dados
  }

  // Criando o objeto de dados para enviar
  const dadosLogin = {
    identificador: identificador,
    senha: senha
  };

  try {
    // Enviando a requisição POST para a API
    const resposta = await fetch('Http://localhost:3000/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosLogin)
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      // Login bem-sucedido
      // Armazenar o token JWT ou informações do usuário, se aplicável
      // Exemplo: localStorage.setItem('token', resultado.token);

      // Exibir mensagem de sucesso
      popupTitle.textContent = 'Login Bem-Sucedido';
      popupMessage.textContent = 'Você foi autenticado com sucesso!';
      popup.style.display = 'block';

      // Redirecionar para a página principal após alguns segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      // Erro no login
      popupTitle.textContent = 'Erro no Login';
      popupMessage.textContent = resultado.mensagem || 'Credenciais inválidas. Por favor, tente novamente.';
      popup.style.display = 'block';
    }
  } catch (erro) {
    console.error('Erro ao enviar requisição:', erro);
    popupTitle.textContent = 'Erro no Login';
    popupMessage.textContent = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
    popup.style.display = 'block';
  }
});
