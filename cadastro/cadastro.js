// Selecionando elementos do DOM
const form = document.getElementById('formCadastro');
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
  const nome = document.getElementById('nome').value;
  const identificador = document.getElementById('identificador').value;
  const email = document.getElementById('email').value;
  const dataNascimento = document.getElementById('dataNascimento').value;
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  // Expressões regulares para validação
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;

  let mensagemErro = '';

  // Validação do email
  if (!emailRegex.test(email)) {
    mensagemErro += '• O email deve ser válido.<br>';
  }

  // Validação da senha
  if (!senhaRegex.test(senha)) {
    mensagemErro += '• A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula e um caractere especial.<br>';
  }

  // Verifica se as senhas coincidem
  if (senha !== confirmarSenha) {
    mensagemErro += '• As senhas não coincidem.<br>';
  }

  // Verifica se há erros de validação
  if (mensagemErro) {
    // Exibe o pop-up de erro
    popupTitle.textContent = 'Erro no Cadastro';
    popupMessage.innerHTML = mensagemErro;
    popup.style.display = 'block';
    return; // Interrompe o processamento para não enviar os dados
  }

  // Criando o objeto de dados para enviar
  const dadosUsuario = {
    nome: nome,
    identificador: identificador,
    senha: senha,
    email: email,
    data_nascimento: dataNascimento
  };

  try {
    // Enviando a requisição POST para a API
    const resposta = await fetch('http://localhost:3000/usuarios/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosUsuario)
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      // Cadastro bem-sucedido
      popupTitle.textContent = 'Cadastro Realizado';
      popupMessage.textContent = 'Seu cadastro foi realizado com sucesso!';
      popup.style.display = 'block';

      // Redirecionar para a página de login após alguns segundos
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
    } else {
      // Erro no cadastro
      popupTitle.textContent = 'Erro no Cadastro';
      popupMessage.innerHTML = resultado.mensagem || 'Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.';
      popup.style.display = 'block';
    }
  } catch (erro) {
    console.error('Erro ao enviar requisição:', erro);
    popupTitle.textContent = 'Erro no Cadastro';
    popupMessage.textContent = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
    popup.style.display = 'block';
  }
});

var cleave = new Cleave('#dataNascimento', {
  date: true,
  datePattern: ['Y', 'm', 'd'], // Formato: Ano/Mês/Dia
  delimiter: '/',               // Delimitador '/'
  onValueChanged: function(e) {
    // Opcional: Adicionar lógica quando o valor muda
  }
});

const dataRegex = /^\d{4}\/\d{2}\/\d{2}$/;
if (!dataRegex.test(dataNascimento)) {
  mensagemErro += '• A data deve estar no formato AAAA/MM/DD.<br>';
}
