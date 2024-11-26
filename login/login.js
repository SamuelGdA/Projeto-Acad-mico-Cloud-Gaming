document.addEventListener('DOMContentLoaded', function() {
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

    // Capturando os valores dos campos com .trim()
    const identificador = document.getElementById('identificador').value.trim();
    const senha = document.getElementById('senhaLogin').value;

    // Expressões regulares para validação
    const identificadorRegex = /^[^\s@]+$/; // Não permite espaços ou caracteres '@'
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

    // Log para depuração
    console.log('Dados de Login Enviados:', dadosLogin);

    try {
      // Opcional: Adicionar um indicador de carregamento aqui
      // Exemplo:
      // form.querySelector('button[type="submit"]').disabled = true;
      // form.querySelector('button[type="submit"]').textContent = 'Entrando...';

      // Enviando a requisição POST para a API
      const resposta = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
      });

      // Verifica se a resposta é JSON
      const contentType = resposta.headers.get('content-type');
      let resultado;
      if (contentType && contentType.includes('application/json')) {
        resultado = await resposta.json();
      } else {
        throw new Error('Resposta não está no formato JSON.');
      }

      console.log('Resposta da API:', resultado);

      if (resposta.ok) {
        await guardarIdUsuario();

        // Login bem-sucedido
        // Armazenar o token JWT ou informações do usuário, se aplicável
        if (resultado.token) {
          localStorage.setItem('token', resultado.token);
          console.log('Token JWT armazenado no localStorage.');
        } else {
          console.warn('Nenhum token JWT recebido.');
        }

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
        popupMessage.innerHTML = resultado.mensagem || 'Credenciais inválidas. Por favor, tente novamente.';
        popup.style.display = 'block';
      }
    } catch (erro) {
      console.error('Erro ao enviar requisição:', erro);
      popupTitle.textContent = 'Erro no Login';
      popupMessage.textContent = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
      popup.style.display = 'block';
    } finally {
      // Opcional: Remover o indicador de carregamento aqui
      // Exemplo:
      // form.querySelector('button[type="submit"]').disabled = false;
      // form.querySelector('button[type="submit"]').textContent = 'Entrar';
    }
  });
});

// Função pro login
async function guardarIdUsuario(dadosLogin) {
  try {
      const response = fetch(`http://localhost:3000/usuarios/user/${dadosLogin.identificador}/responder`)
      if (!response.ok) {
        throw new Error('Erro ao buscar o usuário.');
      }
    
      const usuario = await response.json();

      idUsuario = usuario.id;
      idUsuarioLogado = usuario.id;
  } catch (error) {
      console.error(error);
  }
}
