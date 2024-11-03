document.getElementById('formCadastro').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o envio do formulário

  // Obtém os valores dos campos
  const email = document.querySelector('input[name="email"]').value;
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

  if (mensagemErro) {
    // Exibe o pop-up de erro
    document.getElementById('popupMessage').innerHTML = mensagemErro;
    document.getElementById('popup').style.display = 'block';
  } else {
    // Envia o formulário ou realiza outras ações
    alert('Cadastro realizado com sucesso!');
    // Aqui você pode redirecionar o usuário ou limpar o formulário
  }
});

// Fecha o pop-up ao clicar no "X"
document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('popup').style.display = 'none';
});

// Fecha o pop-up ao clicar fora dele
window.addEventListener('click', function(event) {
  if (event.target === document.getElementById('popup')) {
    document.getElementById('popup').style.display = 'none';
  }
});
