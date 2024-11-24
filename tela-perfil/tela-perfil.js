const idUrl = parseInt(window.location.pathname.split('/').pop(), 10);

if(idUsuario !== idUrl) {
  document.getElementsByClassName('editar-foto')[0].style.display = 'none';
  document.getElementsByClassName('nav-meus-dados')[0].style.display = 'none';
  document.getElementsByClassName('meus-dados')[0].style.display = 'none';
}

// Navegação pelas páginas contidas no card-perfil

const navItens = [
  { button: document.getElementsByClassName('nav-jogos-fav')[0], content: document.getElementsByClassName('jogos-favoritos')[0] },
  { button: document.getElementsByClassName('nav-amigos')[0], content: document.getElementsByClassName('amigos')[0] },
  { button: document.getElementsByClassName('nav-avaliacoes')[0], content: document.getElementsByClassName('avaliacoes')[0] },
  { button: document.getElementsByClassName('nav-meus-dados')[0], content: document.getElementsByClassName('meus-dados')[0] },
];

function selecaoNavItem(index) {
  navItens.forEach((item, i) => {
      item.content.style.display = i === index ? 'flex' : 'none';
      item.button.classList.toggle('li-selecionada', i === index);
  });
}

navItens.forEach((item, index) => {
  item.button.addEventListener('click', () => selecaoNavItem(index));
});

// Botão de alterar foto de perfil
const btnEditarFoto = document.getElementsByClassName('foto-perfil')[0];
const janelaModal = document.getElementsByClassName('janela-modal')[0];
const modalEditarFoto = document.getElementsByClassName('modal-foto')[0];

async function carregarFotoAtual() {
  const minhaFoto = document.getElementById('foto-atual');
  minhaFoto.src = await mostrarFotoPerfil(idUsuario);
}

btnEditarFoto.addEventListener('click', () => {
  carregarFotoAtual();
  const fileInput = document.getElementById('upload-foto');
  fileInput.value = '';
  janelaModal.style.display = 'flex';
  modalEditarFoto.style.display = 'flex';

  carregarFotosPerfil();
});

const opcoesFotos = document.getElementsByClassName('opcoes-fotos')[0];
const fotosArray = Array.from(opcoesFotos.querySelectorAll('img'));

let imagemSelecionada = null;
let idFotoSelecionada = null;

fotosArray.forEach((img) => {
  img.addEventListener('click', () => {
      if (imagemSelecionada) {
          imagemSelecionada.classList.remove('foto-selecionada');
      }

      img.classList.add('foto-selecionada');
      imagemSelecionada = img;
      idFotoSelecionada = img.getAttribute('data-id');
      novaFotoPerfil = null; 
      console.log(idFotoSelecionada);
  });
});

const uploadInput = document.getElementById('upload-foto');
let novaFotoPerfil = null;

uploadInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
          const fotoAtual = document.getElementById('foto-atual');
          fotoAtual.src = e.target.result; // exibe a foto carregada
          novaFotoPerfil = file; // guarda o arquivo pro upload futuro
      };

      reader.readAsDataURL(file);
  }
});

async function uploadNovaFotoPerfil() {
  if (!novaFotoPerfil) {
      console.log('Nenhuma nova foto selecionada para upload.');
      return;
  }

  const formData = new FormData();
  formData.append('foto', novaFotoPerfil);

  try {
      const response = await fetch(`http://localhost:3000/fotosdeperfil/upload/${idUsuario}`, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error('Erro ao fazer upload da nova foto de perfil.');
      }

      const result = await response.json();
      console.log(result.message);

      await getInfoUsuario(idUsuario);
      modalEditarFoto.style.display = 'none';
      janelaModal.style.display = 'none';
  } catch (error) {
      console.error('Erro ao fazer upload da nova foto de perfil:', error);
  }
}

async function carregarFotosPerfil() {
  try {
      const response = await fetch('http://localhost:3000/fotosdeperfil');
      if (!response.ok) {
          throw new Error('Erro ao carregar as fotos de perfil.');
      }

      const fotos = await response.json();

      if (fotos.length === 0) {
          console.log('Nenhuma foto de perfil encontrada.');
          return;
      }

      const opcoesFotosContainer = document.querySelector('.opcoes-fotos');
      const imagens = opcoesFotosContainer.querySelectorAll('img');

      imagens.forEach(imagem => {
          imagem.remove();
      });

      fotos.forEach(foto => {
          const imgElement = document.createElement('img');
          imgElement.src = `data:image/jpeg;base64,${foto.filedata}`;
          imgElement.alt = 'Foto de perfil';
          imgElement.setAttribute('data-id', foto.id);
          opcoesFotosContainer.appendChild(imgElement);
      });

      opcoesFotosContainer.addEventListener('click', (e) => {
          if (e.target.tagName === 'IMG') {
              const fotoAtual = document.getElementById('foto-atual');
              fotoAtual.src = e.target.src;
              e.target.classList.add('foto-selecionada');
              idFotoSelecionada = e.target.getAttribute('data-id');
              console.log(`Foto selecionada: ID ${idFotoSelecionada}`);

              novaFotoPerfil = null; 

              Array.from(opcoesFotosContainer.children).forEach(img => {
                  if (img !== e.target) {
                      img.classList.remove('foto-selecionada');
                  }
              });
          }
      });

  } catch (error) {
      console.error('Erro ao carregar as fotos de perfil:', error);
  }
}

async function atualizarFotoPerfil() {
  if (idFotoSelecionada === null) {
      console.log('Nenhuma foto de perfil selecionada.');
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/fotosdeperfil/atualizar/${idUsuario}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id_foto_perfil: idFotoSelecionada
          }),
      });

      modalEditarFoto.style.display = 'none';
      janelaModal.style.display = 'none';
      await getInfoUsuario(idUsuario);

      if (!response.ok) {
          throw new Error('Erro ao atualizar a foto de perfil.');
      }

      const result = await response.json();
      console.log(result.message);
  } catch (error) {
      console.error('Erro ao atualizar a foto de perfil:', error);
  }
}

// Confirmar/Cancelar foto de perfil

const btnConfirmarFotoPerfil = document.getElementsByClassName('btn-confirmar-fp')[0]
const btnCancelarFotoPerfil = document.getElementsByClassName('btn-cancelar-fp')[0]

btnConfirmarFotoPerfil.addEventListener('click', async () => {
  if (novaFotoPerfil) {
      console.log('atualizar com upload')
      await uploadNovaFotoPerfil();
  } else if (idFotoSelecionada) {
      console.log('atualizar com original')
      await atualizarFotoPerfil();
  } else {
      console.log('Nenhuma foto foi selecionada.');
  }
});

btnCancelarFotoPerfil.addEventListener('click', () => {
  modalEditarFoto.style.display = 'none';
  janelaModal.style.display = 'none';
})

// Modo de edição - Alterar meus dados

const blocoMsgTopo = document.getElementsByClassName('bloco-msg-topo')[0];
const msgTopo = document.getElementsByClassName('msg-topo')[0];

const btnAlterarDados = document.getElementsByClassName('btn-alterar-dados')[0];
const btnAlterarSenha = document.getElementsByClassName('btn-alterar-senha')[0];
const btnConcluirDados = document.querySelector('.editar-dados .btn-concluir');
const btnConcluirSenha = document.querySelector('.editar-senha .btn-concluir');
const btnCancelarDados = document.querySelector('.editar-dados .btn-cancelar');
const btnCancelarSenha = document.querySelector('.editar-senha .btn-cancelar');

const btnDeletarConta = document.getElementsByClassName('btn-deletar-conta')[0];

const modoMostraDados = document.getElementsByClassName('mostra-dados')[0];
const modoEditaDados = document.getElementsByClassName('editar-dados')[0];
const modoEditaSenha = document.getElementsByClassName('editar-senha')[0];

btnAlterarDados.addEventListener('click', () => {
  const nameValue = document.getElementsByClassName('name-value')[0].textContent;
  const usernameValue = document.getElementsByClassName('username-value')[0].textContent;
  const emailValue = document.getElementsByClassName('email-value')[0].textContent;

  mensagensErro[0].textContent = "";
  mensagensErro[1].textContent = "";
  mensagensErro[2].textContent = "";
  modoMostraDados.style.display = 'none'
  modoEditaSenha.style.display = 'none'
  modoEditaDados.style.display = 'flex'

  document.getElementById('name').value = nameValue;
  document.getElementById('username').value = usernameValue;
  document.getElementById('email').value = emailValue;
})

// Validar dados e sair do modo de edição - Concluir

const mensagensErro = Array.from(document.querySelectorAll('.msg'));

const atualizaDados = async (idUsuario, dados) => {
  try {
      const response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dados),
      });

      if (!response.ok) {
          throw new Error('Erro ao atualizar os dados do usuário.');
      }

      const resultado = await response.json();
      console.log('Dados atualizados com sucesso:', resultado);
  } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
  }
};

btnConcluirDados.addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();

  mensagensErro.forEach(msg => msg.textContent = '');

  // Validações
  const nomeValido = validaNome(name);
  const usernameValido = await validaUsername(username, idUsuario);
  const emailValido = await validaEmail(email, idUsuario);

  if (!nomeValido || !usernameValido || !emailValido) {
      return;
  } else {
      const novosDados = {
          nome: nomeValido,
          identificador: usernameValido,
          email: emailValido,
      };
  
      await atualizaDados(idUsuario, novosDados);
  
      await getInfoUsuario(idUsuario);
  
      modoEditaSenha.style.display = 'none';
      modoEditaDados.style.display = 'none';
      modoMostraDados.style.display = 'flex';
  }

  
});

function validaNome(nome) {
  if (nome.length < 2) {
      mensagensErro[0].textContent = "O nome deve ter pelo menos 2 caracteres.";
      return false;
  }
  return nome;
}

async function validaUsername(username, idUsuario) {
  if (username.length < 5) {
      mensagensErro[1].textContent = "O username deve ter pelo menos 5 caracteres.";
      return false;
  }

  try {
      const response = await fetch(`http://localhost:3000/usuarios/verificar-username/${username}/${idUsuario}`);
      if (!response.ok) {
          throw new Error("Erro ao verificar username.");
      }

      const { usernameExiste } = await response.json();

      if (usernameExiste) {
          mensagensErro[1].textContent = "O username já está em uso.";
          return false;
      } else {
          mensagensErro[1].textContent = "";
          return username;
      }
  } catch (error) {
      console.error(error);
      mensagensErro[1].textContent = "Erro ao verificar o username. Tente novamente.";
      return false;
  }
}

async function validaEmail(email, idUsuario) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      mensagensErro[2].textContent = "Insira um e-mail válido.";
      return false;
  }

  try {
      const response = await fetch(`http://localhost:3000/usuarios/verificar-email/${email}/${idUsuario}`);
      if (!response.ok) {
          throw new Error("Erro ao verificar e-mail.");
      }

      const { emailExiste } = await response.json();

      if (emailExiste) {
          mensagensErro[2].textContent = "O e-mail já está em uso.";
          return false;
      } else {
          mensagensErro[2].textContent = "";
          return email;
      }
  } catch (error) {
      console.error(error);
      mensagensErro[2].textContent = "Erro ao verificar o e-mail. Tente novamente.";
      return false;
  }
}

const atualizaSenha = async (idUsuario, dados) => {
  try {
      const response = await fetch(`http://localhost:3000/usuarios/${idUsuario}/senha`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (!response.ok) {
          throw new Error(resultado.message || 'Erro ao atualizar a senha do usuário.');
      }

      console.log('Senha atualizada com sucesso:', resultado);
      return resultado;
  } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
      throw error;
  }
};


btnConcluirSenha.addEventListener('click', async () => {
  const senhaAtual = document.getElementById('senha-atual').value.trim();
  const novaSenha = document.getElementById('nova-senha').value.trim();
  const confirmaSenha = document.getElementById('conf-nova-senha').value.trim();

  // Limpa todas as mensagens de erro antes de validar
  mensagensErro.forEach(msg => msg.textContent = '');

  // Validações
  const senhaAtualValida = validaSenhaAtual(senhaAtual);
  const novaSenhaValida = validaNovaSenha(novaSenha);
  const confirmaSenhaValida = validaConfirmacaoSenha(novaSenha, confirmaSenha);

  if (!senhaAtualValida || !novaSenhaValida || !confirmaSenhaValida) {
      return;
  }

  const trocaSenha = {
      senhaAtual: senhaAtual,
      novaSenha: novaSenha
  };

  console.log("Dados para troca de senha:", trocaSenha);

  try {
      await atualizaSenha(idUsuario, trocaSenha);

      blocoMsgTopo.style.display = 'block';
      msgTopo.textContent = "Senha atualizada com sucesso.";

      setTimeout(() => {
          blocoMsgTopo.style.display = 'none';
      }, 3000);

      modoEditaSenha.style.display = 'none';
      modoEditaDados.style.display = 'none';
      modoMostraDados.style.display = 'flex';
  } catch (error) {
      blocoMsgTopo.style.display = 'block';
      msgTopo.textContent = "Erro ao atualizar a senha. Tente novamente.";

      setTimeout(() => {
          blocoMsgTopo.style.display = 'none';
      }, 3000);

  }
});

function validaSenhaAtual(senha) {
  if (senha.length < 8) {
      mensagensErro[3].textContent = "A senha deve ter no mínimo 8 caracteres.";
      return false;
  }
  return senha;
}

function validaNovaSenha(senha) {
  if (senha.length < 8) {
      mensagensErro[4].textContent = "A nova senha deve ter 8 caracteres.";
      return false;
  }
  return senha;
}

function validaConfirmacaoSenha(novaSenha, confirmaSenha) {
  if (novaSenha !== confirmaSenha) {
      mensagensErro[5].textContent = "As senhas não coincidem.";
      return false;
  }
  return novaSenha;
}

// Entrar no modo de edição de senha

btnAlterarSenha.addEventListener('click', () => {
  // Limpa os campos de input
  document.getElementById('senha-atual').value = "";
  document.getElementById('nova-senha').value = "";
  document.getElementById('conf-nova-senha').value = "";

  modoEditaDados.style.display = 'none'
  modoMostraDados.style.display = 'none'
  modoEditaSenha.style.display = 'flex'
})

// Botões de cancelar

function cancelarEdicao() {
  modoEditaDados.style.display = 'none';
  modoEditaSenha.style.display = 'none';
  modoMostraDados.style.display = 'flex';
}

btnCancelarDados.addEventListener('click', cancelarEdicao);
btnCancelarSenha.addEventListener('click', cancelarEdicao);

// Botão de exclusão da conta

const btnConfirmarExclusao = document.getElementsByClassName('btn-confirmar-exclusao')[0];
const modalExclusao = document.getElementsByClassName('modal-excluir-conta')[0];

btnDeletarConta.addEventListener('click', () => {
  janelaModal.style.display = 'flex';
  modalExclusao.style.display = 'flex';
})

const btnExcluirConta = document.getElementsByClassName('btn-confirmar-exclusao')[0];

const btnToggleSenhaExclusao = document.getElementsByClassName('bi-eye-slash')[0];
const inputSenhaExclusao = document.getElementById('senha-para-exclusao');

btnToggleSenhaExclusao.addEventListener('click', () => {
  if (inputSenhaExclusao.type === 'password') {
      inputSenhaExclusao.type = 'text';
      btnToggleSenhaExclusao.classList.remove('bi-eye-slash');
      btnToggleSenhaExclusao.classList.add('bi-eye');
  } else {
      inputSenhaExclusao.type = 'password';
      btnToggleSenhaExclusao.classList.remove('bi-eye');
      btnToggleSenhaExclusao.classList.add('bi-eye-slash');
  }
});

const msgErroExclusao = document.getElementById('msg-erro-exclusao')

btnConfirmarExclusao.addEventListener('click', async () => {
  console.log(inputSenhaExclusao.value)
  const senha = inputSenhaExclusao.value;

  if(!senha) {
      msgErroExclusao.style.display = 'block'
      msgErroExclusao.textContent = "A senha é necessária para continuar."
  }

  try {
      const response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ senha }),
      });

      if (response.ok) {
          const result = await response.json();
          console.log(result)
          window.location.href = '/logout';
      } else {
          const error = await response.json();
          msgErroExclusao.style.display = 'block'
          msgErroExclusao.textContent = "Senha inválida."
          console.log(error);
      }
  } catch (error) {
      console.error('Erro ao excluir a conta:', error);
  }
});
