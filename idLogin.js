const idUsuario = null;

async function obterIdUsuario() {
    try {
      const response = await fetch('http://localhost:3000/usuario/logado', {
        method: 'GET',
        credentials: 'same-origin'
      });
  
      if (!response.ok) {
        throw new Error('Usuário não está logado');
      }
  
      const data = await response.json();
      idUsuario = data.idUsuario;
  
      console.log('ID do usuário:', usuarioId);
    } catch (error) {
      console.error('Erro ao obter o ID do usuário:', error.message);
    }
  }
  
  obterIdUsuario();
  