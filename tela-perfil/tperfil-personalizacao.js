// Dados do usuário para teste

let idUsuario = 7

// Buscar a foto de perfil do usuário

const mostrarFotoPerfil = async (id) => {
  try {
      const response = await fetch(`http://localhost:3000/fotosdeperfil/usuario/${id}`);
      if (!response.ok) {
          throw new Error('Erro ao buscar a foto de perfil.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob); 

      return url
  } catch (error) {
      console.error(error);
  }
};

// Buscar plano do usuário

const getPlanoUsuario = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/planos/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar o plano.');
    }

    const plano = await response.json();

    console.log('Informações do Plano:', plano);
    
    const planoUsuario = document.getElementsByClassName('plano')[0];
    planoUsuario.textContent = plano.nome;

  } catch (error) {
    console.error(error);
  }
};

// Buscar informações do usuário

const getInfoUsuario = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/usuarios/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar o usuário.');
    }

    const usuario = await response.json();

    console.log('Informações do Usuário:', usuario);
    
    // Já mostra a foto de perfil
    const imgElement = document.getElementById('foto-usuario');
    imgElement.src = await mostrarFotoPerfil(usuario.id);
    
    await getPlanoUsuario(usuario.id_plano)

    const nomeUsuario = document.getElementsByClassName('nome-usuario')[0];
    const usernameUsuario = document.getElementsByClassName('username-usuario')[0];
    nomeUsuario.textContent = usuario.nome;
    usernameUsuario.textContent = "@" + usuario.identificador;

  } catch (error) {
    console.error(error);
  }
};

// Buscar as amizades do usuário

const getAmizadesUsuario = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/amizades/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar amizades.');
    }

    const amizades = await response.json();

    console.log('Informações das Amizades:', amizades);
    
    const listaAmigos = document.getElementById('lista-amigos');
    const abaListaAmigos = document.getElementById('aba-lista-amigos')

    for(const amizade of amizades) {
      // Adiciona os amigos no aside
      const linkAmigo = document.createElement('a');
      linkAmigo.innerHTML = `<li>
                        <img src="${await mostrarFotoPerfil(amizade.id)}" alt="Foto de perfil de ${amizade.nome}">
                        <div>
                            <span class="nome-amigo">${amizade.nome}</span>
                            <span class="username-amigo">@${amizade.identificador}</span>
                        </div>
                    </li>`
      listaAmigos.appendChild(linkAmigo)

      // Adiciona os amigos na aba do perfil
      const abaLinkAmigo = document.createElement('a');
      abaLinkAmigo.innerHTML = `<li>
                        <img src="${await mostrarFotoPerfil(amizade.id)}" alt="Foto de perfil de ${amizade.nome}">
                        <div>
                            <span class="nome-amigo">${amizade.nome}</span>
                            <span class="username-amigo">@${amizade.identificador}</span>
                        </div>
                    </li>`

      abaListaAmigos.appendChild(abaLinkAmigo)
    }

  } catch (error) {
    console.error(error);
  }
};

getInfoUsuario(idUsuario); // aqui efetivamente se pega a foto e o plano
getAmizadesUsuario(idUsuario);

// Buscar avaliações

function formataData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
};

function countingStars(nota) {
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < nota) {
            stars.push('<i class="bi bi-star-fill"></i>');
        } else {
            stars.push('<i class="bi bi-star"></i>');
        }
    }

    return stars.join(' ');
};

const getAvaliacoes = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/avaliacoes/usuario/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar avaliações.');
      }
  
      const avaliacoes = await response.json();
  
      console.log('Informações de Avaliações:', avaliacoes);
      
      for(const avaliacao of avaliacoes) {
        const dataFormatada = formataData(avaliacao.data_avaliacao)

        const listaAvaliacoes = document.getElementById('lista-avaliacoes')
        const itemAvaliacao = document.createElement('li');

        itemAvaliacao.innerHTML = `<img src="${await mostrarFotoPerfil(idUsuario)}" alt="">
                        <div class="dados-comentario">
                            <div>
                                <span class="nome-usuario">${avaliacao.nome_usuario}</span>
                                <span class="username-usuario">@${avaliacao.identificador_usuario}</span>
                                <span class="jogo-relacionado">sobre ${avaliacao.nome_jogo}</span>
                            </div>
                            <span class="data-avaliacao">publicado em ${dataFormatada}</span>
                            <div class="stars">${countingStars(avaliacao.nota)}</div>
                            <p class="comentario">${avaliacao.comentario}</p>`

        listaAvaliacoes.appendChild(itemAvaliacao);
      }
  
    } catch (error) {
      console.error(error);
    }
};

getAvaliacoes(idUsuario)

// Adicionar foto de perfil

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const tipoInput = document.getElementById('tipoInput');
  
    if (!fileInput.files.length) {
      alert('Por favor, selecione uma imagem.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('tipo', tipoInput.value);
  
    try {
      const response = await fetch('http://localhost:3000/api/foto_perfil/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Foto de perfil enviada com sucesso! ID da foto: ' + result.fotoId);
      } else {
        const error = await response.json();
        alert('Erro: ' + error.message);
      }
    } catch (err) {
      console.error('Erro ao enviar a imagem:', err);
    }
};
