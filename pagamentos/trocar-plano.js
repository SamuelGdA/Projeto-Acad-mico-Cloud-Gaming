

// Função para fechar o modal
const fecharModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Oculta o modal
};

// Função para buscar o plano atual do usuário
const fetchPlanoAtual = async () => {
    try {
        const usuarioResponse = await fetch(`http://localhost:3000/usuarios/${idUsuario}`);
        const usuario = await usuarioResponse.json();

        // Verifica se o usuário possui um plano associado
        if (!usuario.id_plano) {
            throw new Error("Usuário não possui um plano associado.");
        }

        const planoResponse = await fetch(`http://localhost:3000/planos/${usuario.id_plano}`);
        const planoAtual = await planoResponse.json();

        return planoAtual;
    } catch (error) {
        console.error("Erro ao buscar o plano atual:", error);
        return null;
    }
};

// Função para buscar todos os planos disponíveis
const fetchPlanosDisponiveis = async (planoAtualId) => {
    try {
        const planosResponse = await fetch(`http://localhost:3000/planos/`);
        const todosPlanos = await planosResponse.json();
        // Filtra os planos para excluir o atual
        const planosDisponiveis = todosPlanos.filter(plano => plano.id !== planoAtualId);
        return planosDisponiveis;
    } catch (error) {
        console.error("Erro ao buscar os planos disponíveis:", error);
        return [];
    }
};

// Função para abrir o modal e exibir as informações do plano selecionado
const abrirModal = (nome, preco, planoId) => {
    const modal = document.getElementById('modal');
    const planoSelecionado = document.getElementById('planoSelecionado');
    const precoSelecionado = document.getElementById('precoSelecionado');
    const botaoComprar = document.getElementById('comprarPlanoButton');

    // Define as informações do plano selecionado no modal
    planoSelecionado.innerText = nome;
    precoSelecionado.innerText = preco;
    modal.style.display = 'block'; // Exibe o modal
    botaoComprar.style.display = 'block'; // Exibe o botão de compra
    botaoComprar.onclick = () => comprarPlano(planoId); // Define a ação do botão de compra
};

// Fecha o modal ao clicar fora do conteúdo
document.getElementById('modal').addEventListener('click', (event) => {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent.contains(event.target)) {
        fecharModal(); // Fecha o modal se clicar fora do conteúdo
    }
});

// Função para renderizar os planos no DOM
const renderPlanos = async () => {
    const idUsuario = 1;
    const planoAtual = await fetchPlanoAtual(idUsuario);

    // Verifica se o plano atual foi carregado com sucesso
    if (planoAtual) {
        const mensalidadeAtual = parseFloat(planoAtual.mensalidade);
        const planoAtualContainer = document.querySelector('.plano-atual');
        planoAtualContainer.innerHTML = `
            <h2>Plano Atual</h2>
            <p>${planoAtual.nome}</p>
            <p>R$${mensalidadeAtual.toFixed(2)} por mês</p>
        `;

        const planosDisponiveis = await fetchPlanosDisponiveis(planoAtual.id);
        const planosContainer = document.querySelector('.planos-disponiveis');
        planosContainer.innerHTML = '<h2>Planos Disponíveis</h2>';

        // Renderiza cada plano disponível
        planosDisponiveis.forEach(plano => {
            const mensalidadePlano = parseFloat(plano.mensalidade);
            const divPlano = document.createElement('div');
            divPlano.classList.add('plano');
            divPlano.addEventListener('click', () => abrirModal(plano.nome, `R$${mensalidadePlano.toFixed(2)}`, plano.id));
            divPlano.innerHTML = `
                <h3>${plano.nome}</h3>
                <p>R$${mensalidadePlano.toFixed(2)}</p>
            `;
            planosContainer.appendChild(divPlano);
        });
    } else {
        console.error("Não foi possível carregar o plano atual.");
    }
};

// Função para processar a compra do plano
const comprarPlano = async (planoId) => {
    console.log("Plano ID selecionado:", planoId);
    const formaPagamentoId = document.querySelector('.cartao-mini.selecionado')?.dataset.id;

    // Verifica se uma forma de pagamento foi selecionada
    if (!formaPagamentoId) {
        alert('Selecione uma forma de pagamento para continuar!');
        return;
    }

    const pagamentoData = {
        id_usuario: idUsuario,
        id_forma_pagamento: formaPagamentoId,
        id_plano: planoId,
    };

    try {
        const response = await fetch('http://localhost:3000/pagamentos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pagamentoData),
        });

        const result = await response.json();
        console.log("Resposta da API:", result);
        if (response.ok) {
            alert('Plano comprado com sucesso!');
            fecharModal(); // Fecha o modal após a compra
            renderPlanos(); // Atualiza a lista de planos
        } else {
            alert('Erro ao comprar o plano: ' + result.message);
            console.error("Erro na requisição:", result);
        }

    } catch (error) {
        console.error('Erro na requisição de pagamento:', error);
        alert('Erro ao tentar comprar o plano.');
    }
};

document.addEventListener("DOMContentLoaded", async function () {

    // Função para buscar os cartões salvos do usuário
    const fetchCartoesSalvos = async () => {
        try {
            const pagamentosResponse = await fetch(`http://localhost:3000/pagamentos/getformas/${idUsuario}`);
            const textResponse = await pagamentosResponse.text();
            console.log(textResponse);
            const pagamentos = JSON.parse(textResponse);
            return pagamentos;
        } catch (error) {
            console.error("Erro ao buscar pagamentos salvos:", error);
            return [];
        }
    };

    // Função para renderizar os cartões salvos ou mensagem de não ter cartões
    const renderCartoesSalvos = async () => {
        const pagamentosSalvos = await fetchCartoesSalvos(idUsuario);
        const salvosContainer = document.querySelector('#salvos');

        // Verifica se existem cartões salvos
        if (pagamentosSalvos.length > 0) {
            pagamentosSalvos.forEach(pagamento => {
                const divCartao = document.createElement('div');
                divCartao.classList.add('cartao-mini');
                divCartao.dataset.id = pagamento.id;
                divCartao.innerHTML = `
                    <i class="bi bi-credit-card-2-front-fill"></i>
                    <span>${pagamento.nome_no_cartao}</span>
                `;
                divCartao.addEventListener('click', () => {
                    // Marca o cartão como selecionado
                    document.querySelectorAll('.cartao-mini').forEach(card => card.classList.remove('selecionado'));
                    divCartao.classList.add('selecionado');
                });
                salvosContainer.appendChild(divCartao);
            });
        } else {
            salvosContainer.innerHTML = `<p>Você não tem formas de pagamento cadastradas.</p>`;
        }
    };

    renderCartoesSalvos();
    renderPlanos();
});
