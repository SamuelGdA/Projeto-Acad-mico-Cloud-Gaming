document.addEventListener('DOMContentLoaded', function() {
  // Seleciona os contêineres onde os planos e apresentações serão exibidos
  const planosContainer = document.querySelector('.pg-planos');
  const apresentacaoContainer = document.querySelector('.pg-apresentacao');
  console.log('Contêiner de Planos Selecionado:', planosContainer);
  console.log('Contêiner de Apresentação Selecionado:', apresentacaoContainer);

  if (!planosContainer) {
      console.error('Erro: Contêiner .pg-planos não encontrado no DOM.');
      return;
  }

  if (!apresentacaoContainer) {
      console.error('Erro: Contêiner .pg-apresentacao não encontrado no DOM.');
      return;
  }

  // Função para criar um elemento de plano
  function criarPlano(plano) {
      console.log('Criando plano:', plano);

      // Verifica se todas as propriedades necessárias existem
      if (!plano.nome || !plano.mensalidade || !plano.descricao) {
          console.warn('Plano incompleto ou mal formatado:', plano);
          return null;
      }

      // Cria o elemento principal do plano
      const planoDiv = document.createElement('div');
      planoDiv.classList.add('pg-plano');

      // Adiciona classes específicas com base no plano, se necessário
      // Exemplo: se o nome for "capitão", adiciona uma classe especial
      const nomeLower = plano.nome.toLowerCase();
      if (nomeLower === 'capitão' || nomeLower === 'capitao') { // Considera acentuação
          planoDiv.classList.add('pg-destaque');
      } else if (nomeLower === 'imediato') {
          planoDiv.classList.add('pg-prata');
      }

      // Adiciona o ID ao plano
      planoDiv.id = `pg-plano-${nomeLower.replace(/\s+/g, '-')}`;
      console.log('ID do Plano:', planoDiv.id);

      // Cria o título do plano
      const titulo = document.createElement('h2');
      titulo.textContent = `💀 Plano ${plano.nome}`;
      planoDiv.appendChild(titulo);

      // Cria o preço do plano
      const preco = document.createElement('p');
      preco.classList.add('pg-preco');
      preco.textContent = `Apenas R$${plano.mensalidade} por mês`;
      planoDiv.appendChild(preco);

      // Cria a lista de benefícios (utilizando 'descricao' como benefício único)
      const beneficiosDiv = document.createElement('div');
      beneficiosDiv.classList.add('pg-beneficios');

      const beneficioItem = document.createElement('div');
      beneficioItem.classList.add('pg-beneficio');
      beneficioItem.textContent = plano.descricao;
      beneficiosDiv.appendChild(beneficioItem);

      planoDiv.appendChild(beneficiosDiv);

      // Cria o botão de assinatura
      const btnAssinar = document.createElement('a');
      btnAssinar.href = 'pagamentos.html'; // Ajuste conforme necessário
      btnAssinar.classList.add('pg-btn-primary');
      btnAssinar.textContent = 'Assine Agora';
      planoDiv.appendChild(btnAssinar);

      return planoDiv;
  }

  // Função para criar um elemento de apresentação do plano
  function criarApresentacao(plano) {
      console.log('Criando apresentação para o plano:', plano);

      // Cria o elemento principal da apresentação
      const apresentacaoDiv = document.createElement('div');
      apresentacaoDiv.classList.add('pg-apresentacao-item');

      // Adiciona uma classe específica com base no nome do plano para aplicar diferentes degradês
      const nomeLower = plano.nome.toLowerCase();
      if (nomeLower === 'tripulante') {
          apresentacaoDiv.classList.add('pg-apresentacao-item-tripulante');
      } else if (nomeLower === 'imediato') {
          apresentacaoDiv.classList.add('pg-apresentacao-item-imediato');
      } else if (nomeLower === 'capitão' || nomeLower === 'capitao') { // Considera acentuação
          apresentacaoDiv.classList.add('pg-apresentacao-item-capitao');
      }

      // Cria o título da apresentação
      const titulo = document.createElement('h2');
      titulo.textContent = `Plano ${plano.nome}`;
      apresentacaoDiv.appendChild(titulo);

      // Cria a descrição da apresentação
      const descricao = document.createElement('p');
      descricao.textContent = plano.descricao;
      apresentacaoDiv.appendChild(descricao);

      return apresentacaoDiv;
  }

  // Função para carregar os planos da API
  async function carregarPlanos() {
      try {
          console.log('Iniciando requisição para carregar planos...');
          const resposta = await fetch('http://localhost:3000/planos/', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          console.log('Resposta da Requisição:', resposta);

          if (!resposta.ok) {
              throw new Error(`Erro ao buscar planos: ${resposta.status} ${resposta.statusText}`);
          }

          const planos = await resposta.json();
          console.log('Planos recebidos da API:', planos);

          // Verifica se 'planos' é um array
          if (!Array.isArray(planos)) {
              throw new Error('Formato de dados inesperado: esperava um array de planos.');
          }

          // Limpa os contêineres existentes
          planosContainer.innerHTML = '';
          apresentacaoContainer.innerHTML = '';
          console.log('Contêineres de Planos e Apresentação Limpos.');

          // Itera sobre os planos e os adiciona aos contêineres
          planos.forEach(plano => {
              const planoElemento = criarPlano(plano);
              if (planoElemento) {
                  planosContainer.appendChild(planoElemento);
                  console.log(`Plano '${plano.nome}' adicionado à seção de Planos.`);
              }

              const apresentacaoElemento = criarApresentacao(plano);
              if (apresentacaoElemento) {
                  apresentacaoContainer.appendChild(apresentacaoElemento);
                  console.log(`Apresentação para o plano '${plano.nome}' adicionada à seção de Apresentação.`);
              }
          });

          // Caso não haja planos
          if (planos.length === 0) {
              planosContainer.innerHTML = '<p>Nenhum plano disponível no momento.</p>';
              apresentacaoContainer.innerHTML = '<p>Nenhum plano disponível para apresentação no momento.</p>';
              console.warn('Nenhum plano foi retornado pela API.');
          }

      } catch (erro) {
          console.error('Erro ao carregar planos:', erro);
          planosContainer.innerHTML = '<p>Não foi possível carregar os planos no momento. Por favor, tente novamente mais tarde.</p>';
          apresentacaoContainer.innerHTML = '<p>Não foi possível carregar as apresentações dos planos no momento. Por favor, tente novamente mais tarde.</p>';
      }
  }

  // Chama a função para carregar os planos quando a página é carregada
  carregarPlanos();
});
