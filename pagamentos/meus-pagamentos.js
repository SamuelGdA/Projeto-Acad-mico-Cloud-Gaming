document.addEventListener("DOMContentLoaded", function() {

  // Função para pegar as formas de pagamento cadastradas do backend
  const fetchFormasPagamentos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pagamentos/getformas/${idUsuario}`);
      const formas = await response.json();
      
      const formasContainer = document.getElementById('formasContainer');

      // Verifica se há formas de pagamento cadastradas
      if (!Array.isArray(formas) || formas.length === 0) {
        formasContainer.innerHTML = '<p>Nenhuma forma de pagamento cadastrada. Faça a sua!</p>';
      } else {
        console.log(formas)
        formasContainer.innerHTML = ''; // Limpa o conteúdo anterior
        formas.forEach(forma => {
          const div = document.createElement('div');
          div.classList.add('forma-pagamento');
          
          // Formatar número do cartão para mostrar parcialmente
          const numeroCartaoFormatado = forma.numero_cartao.replace(/(\d{4})(?=\d)/g, "****-");
          div.innerHTML = `
            <button class="btn-remover" data-id="${forma.id}">REMOVER</button>
            <div class="card-header">Cartão de Pagamento</div>
            <div class="card-type">${forma.tipo_pagamento}</div>
            <div class="card-number">${numeroCartaoFormatado}</div>
            <div class="card-expiry">Validade: ${forma.validade}</div>
            <div class="card-owner">Nome: ${forma.nome_no_cartao}</div>
          `;
          formasContainer.appendChild(div);
        });

        // Adicionando event listener para o botão de remover
        const removeButtons = document.querySelectorAll('.btn-remover');
        removeButtons.forEach(button => {
          button.addEventListener('click', handleRemoverClick);
        });
      }
    } catch (error) {
      console.error("Erro ao buscar as formas de pagamento:", error);
    }
  };

  // Função para lidar com o clique no botão de remover
  const handleRemoverClick = async (event) => {
    const formaId = event.target.getAttribute('data-id');
    if (confirm("Tem certeza que deseja remover esta forma de pagamento?")) {
      try {
        const response = await fetch(`http://localhost:3000/pagamentos/forma/delete/${formaId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert("Forma de pagamento removida com sucesso!");
          fetchFormasPagamentos();  // Atualiza a lista após a remoção
        } else {
          const data = await response.json();
          alert(`Erro: ${data.message}`);
        }
      } catch (error) {
        console.error("Erro ao remover forma de pagamento:", error);
        alert("Ocorreu um erro ao tentar remover a forma de pagamento.");
      }
    }
  };

  // Chama a função quando a página é carregada
  fetchFormasPagamentos();
});

// Formatação da data de validade do cartão
document.getElementById("validadeCartao").addEventListener("input", function (e) {
  let input = e.target.value;

  // Remove qualquer caractere que não seja número
  input = input.replace(/\D/g, '');

  // Adiciona o "/" automaticamente após os dois primeiros dígitos
  if (input.length > 2) {
    input = input.substring(0, 2) + '/' + input.substring(2);
  }

  // Limita o tamanho a 5 caracteres (MM/AA)
  if (input.length > 5) {
    input = input.substring(0, 5);
  }

  e.target.value = input;
});

// Cadastro de nova forma de pagamento
document.getElementById("botaoCadastrarPagamento").addEventListener("click", async () => {

  const tipoPagamento = document.getElementById("tipoPagamento").value;
  const nomeNoCartao = document.getElementById("nomeNoCartao").value;
  const numeroCartao = document.getElementById("numeroCartao").value;
  const validadeCartao = document.getElementById("validadeCartao").value;
  const cvvCartao = document.getElementById("cvvCartao").value;

  // Validação dos campos
  if (!nomeNoCartao || !numeroCartao || !validadeCartao || !cvvCartao) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Validação dos formatos
  if (numeroCartao.length !== 16) {
    alert("O número do cartão deve ter 16 caracteres.");
    return;
  }
  if (validadeCartao.length !== 5) {
    alert("A validade deve ter 5 caracteres (MM/AA).");
    return;
  }
  if (cvvCartao.length !== 3) {
    alert("O CVV deve ter 3 caracteres.");
    return;
  }

  // Criando o objeto de pagamento
  const pagamento = {
    id_usuario: idUsuario,
    id_tipo_pagamento: tipoPagamento,  // Tipo de pagamento (1 = Crédito, 2 = Débito)
    numero_cartao: numeroCartao,
    nome_no_cartao: nomeNoCartao,
    cvv: cvvCartao,
    validade: validadeCartao,
  };

  try {
    // Enviando os dados para a API para cadastrar o pagamento
    const response = await fetch("http://localhost:3000/pagamentos/novaforma", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pagamento),
    });

    const data = await response.json();

    if (response.ok) {
      // Caso o pagamento tenha sido cadastrado com sucesso
      alert("Forma de pagamento cadastrada com sucesso!");
    } else {
      // Caso haja algum erro
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error("Erro ao cadastrar forma de pagamento:", error);
    alert("Ocorreu um erro ao tentar cadastrar a forma de pagamento.");
  }
});
