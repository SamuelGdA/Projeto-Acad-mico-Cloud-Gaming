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

// Modo de edição - Alterar meus dados

const btnAlterarDados = document.getElementsByClassName('btn-alterar-dados')[0]
const btnAlterarSenha = document.getElementsByClassName('btn-alterar-senha')[0]
const btnConcluirDados = document.querySelector('.editar-dados .btn-concluir');
const btnConcluirSenha = document.querySelector('.editar-senha .btn-concluir');

const modoMostraDados = document.getElementsByClassName('mostra-dados')[0]
const modoEditaDados = document.getElementsByClassName('editar-dados')[0]
const modoEditaSenha = document.getElementsByClassName('editar-senha')[0]

btnAlterarDados.addEventListener('click', () => {
  modoMostraDados.style.display = 'none'
  modoEditaSenha.style.display = 'none'
  modoEditaDados.style.display = 'flex'
})

// Validar dados e sair do modo de edição - Concluir

btnConcluirDados.addEventListener('click', () => {
  const nameValue = document.getElementById('name')
  const usernameValue = document.getElementById('username')
  const emailValue = document.getElementById('email')

  


  modoEditaSenha.style.display = 'none'
  modoEditaDados.style.display = 'none'
  modoMostraDados.style.display = 'flex'
})

btnConcluirSenha.addEventListener('click', () => {
  // Adicionar verificação
  modoEditaSenha.style.display = 'none'
  modoEditaDados.style.display = 'none'
  modoMostraDados.style.display = 'flex'
})

// Entrar no modo de edição de senha

btnAlterarSenha.addEventListener('click', () => {
  modoEditaDados.style.display = 'none'
  modoMostraDados.style.display = 'none'
  modoEditaSenha.style.display = 'flex'
})