idUsuario = 7;

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

// Buscar os usuários pelo username e mandar solicitação de amizade

const userSearch = document.getElementsByClassName('pesquisa-usuario')[0];
const btnPesquisar = document.getElementsByClassName('bi-search')[0];
const listaUsuarios = document.getElementsByClassName('lista-usuarios')[0];
const blocoMsgTopo = document.getElementsByClassName('bloco-msg-topo')[0];
const msgTopo = document.getElementsByClassName('msg-topo')[0];

async function pesquisaNoBanco() {
    if(userSearch.value.length >= 3){
        try {
            const response = await fetch(`http://localhost:3000/usuarios/user/${userSearch.value}`);
            if (!response.ok) {
              throw new Error('Erro ao buscar o usuário.');
            }
            
            const usuarios = await response.json();
    
            listaUsuarios.innerHTML = '';
        
            console.log('Informações dos Usuários:', usuarios);
    
            for(const usuario of usuarios) {
                const usuarioBox = document.createElement('a');
                usuarioBox.href = `/tela-perfil.html?id=${usuario.id}`;
                usuarioBox.innerHTML = `<li>
                                        <div class="l-adicionar">
                                          <img src="${await mostrarFotoPerfil(usuario.id)}" alt="">
                                          <div>
                                            <span class="nome-usuario">${usuario.nome}</span>
                                            <span class="username-usuario">@${usuario.identificador}</span>
                                          </div>
                                        </div>
                                        <i class="bi bi-person-fill-add adicionar" data-id="${usuario.id}"></i>
                                        </li>`;
              
                listaUsuarios.appendChild(usuarioBox);
              
                if (idUsuario == usuario.id) {
                  usuarioBox.querySelector('.adicionar').style.display = 'none';
                } else {
                  const resposta = await fetch(`http://localhost:3000/amizades/verificar-pendente/${idUsuario}/${usuario.id}`);
                  const dados = await resposta.json();
                  
                  if (dados.solicitacaoPendente) {
                    usuarioBox.querySelector('.adicionar').style.display = 'none';
                  } else {
                    const respostaAmizade = await fetch(`http://localhost:3000/amizades/verificar/${idUsuario}/${usuario.id}`);
                    const dadosAmizade = await respostaAmizade.json();
                    
                    if (dadosAmizade.saoAmigos) {
                      usuarioBox.querySelector('.adicionar').style.display = 'none';
                    }
                  }
                }

                const btnAdicionar = usuarioBox.querySelector('.adicionar');
                btnAdicionar.addEventListener('click', () => {
                    enviarSolicitacaoAmizade(usuario.id);
                });
            }
        
        } catch (error) {
            console.error(error);
        }
    }
}

btnPesquisar.addEventListener('click', async () => {
    pesquisaNoBanco();
})

userSearch.addEventListener('input', () => {
    pesquisaNoBanco()
})

async function enviarSolicitacaoAmizade(idUsuarioDestinatario) {
    try {
        const response = await fetch(`http://localhost:3000/amizades/solicitar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario_solicitante: idUsuario,
                id_usuario_destinatario: idUsuarioDestinatario,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao enviar solicitação de amizade.');
        }

        blocoMsgTopo.style.display = 'block';
        msgTopo.textContent = data.message || "Solicitação de amizade enviada!";

        setTimeout(() => {
            blocoMsgTopo.style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error(error);

        blocoMsgTopo.style.display = 'block';
        msgTopo.textContent = error.message;

        setTimeout(() => {
            blocoMsgTopo.style.display = 'none';
        }, 3000);
    }
}

// Aceitar ou recusar solicitações de amizade

async function fetchSolicitacoesPendentes() {
    try {
        const response = await fetch(`http://localhost:3000/amizades/pendentes/${idUsuario}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar solicitações pendentes");
        }
        const solicitacoes = await response.json();

        await renderSolicitacoes(solicitacoes);
    } catch (error) {
        console.error(error);
    }
}

async function renderSolicitacoes(solicitacoes) {
    const listaSolicitacoes = document.getElementsByClassName("lista-solicitacoes")[0];
    const pendenciasQtd = document.getElementsByClassName("pendencias-qtd")[0];

    listaSolicitacoes.innerHTML = "";

    pendenciasQtd.textContent = pendenciasQtd.textContent + " (" + solicitacoes.length + ")";

    for(const solicitacao of solicitacoes) {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="l-solicitacao">
                <img src="${await mostrarFotoPerfil(solicitacao.id_solicitante)}" alt="">
                <div class="info-solicitante">
                    <span class="nome-solicitante">${solicitacao.nome_solicitante}</span>
                    <span class="username-solicitante">@${solicitacao.identificador_solicitante}</span>
                </div>
            </div>
            <div class="r-solicitacao">
                <i class="bi bi-check2-square aceitar" data-id="${solicitacao.id_solicitacao}" title="Aceitar"></i>
                <i class="bi bi-x-square recusar" data-id="${solicitacao.id_solicitacao}" title="Recusar"></i>
            </div>
        `;

        listaSolicitacoes.appendChild(li);
    };

    document.querySelectorAll(".aceitar").forEach(btn => {
        btn.addEventListener("click", () => responderSolicitacao(btn.dataset.id, "aceito"));
    });

    document.querySelectorAll(".recusar").forEach(btn => {
        btn.addEventListener("click", () => responderSolicitacao(btn.dataset.id, "rejeitado"));
    });
}

async function responderSolicitacao(idSolicitacao, status) {
    try {
        const response = await fetch(`http://localhost:3000/amizades/${idSolicitacao}/responder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao atualizar solicitação");
        }

        blocoMsgTopo.style.display = 'block';
        msgTopo.textContent = status === "aceito"
            ? "Solicitação de amizade aceita!"
            : "Solicitação de amizade recusada!";

        setTimeout(() => {
            blocoMsgTopo.style.display = 'none';
        }, 3000);

        await fetchSolicitacoesPendentes();
    } catch (error) {
        console.error(error);

        blocoMsgTopo.style.display = 'block';
        msgTopo.textContent = error.message || "Erro ao processar a solicitação. Tente novamente.";

        setTimeout(() => {
            blocoMsgTopo.style.display = 'none';
        }, 3000);
    }
}

fetchSolicitacoesPendentes();
