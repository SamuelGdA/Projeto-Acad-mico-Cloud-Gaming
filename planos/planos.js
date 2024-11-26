document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o contêiner onde os planos serão exibidos
    const planosContainer = document.querySelector('.pg-planos');
  
    // Função para criar um elemento de plano
    function criarPlano(plano) {
      // Cria o elemento principal do plano
      const planoDiv = document.createElement('div');
      planoDiv.classList.add('pg-plano');
  
      // Adiciona classes específicas com base no plano
      if (plano.destaque) {
        planoDiv.classList.add('pg-destaque');
      } else if (plano.nivel === 'prata') {
        planoDiv.classList.add('pg-prata');
      }
  
      // Adiciona o ID ao plano
      planoDiv.id = `pg-plano-${plano.nome.toLowerCase()}`;
  
      // Cria o título do plano
      const titulo = document.createElement('h2');
      titulo.textContent = `💀 Plano ${plano.nome}`;
      planoDiv.appendChild(titulo);
  
      // Cria o preço do plano
      const preco = document.createElement('p');
      preco.classList.add('pg-preco');
      preco.textContent = `Apenas R$${plano.preco} por mês`;
      planoDiv.appendChild(preco);
  
      // Cria a lista de benefícios
      const beneficiosDiv = document.createElement('div');
      beneficiosDiv.classList.add('pg-beneficios');
  
      plano.beneficios.forEach(beneficio => {
        const beneficioItem = document.createElement('div');
        beneficioItem.classList.add('pg-beneficio');
        beneficioItem.textContent = beneficio;
        beneficiosDiv.appendChild(beneficioItem);
      });
  
      planoDiv.appendChild(beneficiosDiv);
  
      // Cria o botão de assinatura
      const btnAssinar = document.createElement('a');
      btnAssinar.href = 'pagamentos.html'; // Ajuste conforme necessário
      btnAssinar.classList.add('pg-btn-primary');
      btnAssinar.textContent = 'Assine Agora';
      planoDiv.appendChild(btnAssinar);
  
      return planoDiv;
    }
  
    // Função para carregar os planos da API
    async function carregarPlanos() {
      try {
        const resposta = await fetch('http://localhost:3000/planos/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!resposta.ok) {
          throw new Error(`Erro ao buscar planos: ${resposta.statusText}`);
        }
  
        const planos = await resposta.json();
        console.log('Planos recebidos da API:', planos);
  
        // Limpa os planos existentes no contêiner
        planosContainer.innerHTML = '';
  
        // Itera sobre os planos e os adiciona ao contêiner
        planos.forEach(plano => {
          const planoElemento = criarPlano(plano);
          planosContainer.appendChild(planoElemento);
        });
      } catch (erro) {
        console.error('Erro ao carregar planos:', erro);
        planosContainer.innerHTML = '<p>Não foi possível carregar os planos no momento. Por favor, tente novamente mais tarde.</p>';
      }
    }
  
    // Chama a função para carregar os planos quando a página é carregada
    carregarPlanos();
  });
  