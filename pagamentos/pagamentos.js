document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = `http://localhost:3000/pagamentos/${idUsuario}`;
    const tabelaBody = document.getElementById("historicoPagamentosBody");

    try {
        // Requisição à API para obter os pagamentos do usuário
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`); // Lança um erro se a resposta não for bem-sucedida
        }

        const pagamentos = await response.json(); // Converte a resposta em JSON

        // Verifica se há dados de pagamentos
        if (!pagamentos.length) {
            tabelaBody.innerHTML = `
                <tr>
                    <td colspan="3">Nenhum pagamento encontrado.</td>
                </tr>
            `;
            return; // Encerra a execução se não houver pagamentos
        }

        // Preenche a tabela com os dados de pagamentos
        pagamentos.forEach(pagamento => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${new Date(pagamento.data_pagamento).toLocaleDateString()}</td>
                <td>${pagamento.tipo_pagamento}</td>
                <td>R$ ${!isNaN(pagamento.valor) ? Number(pagamento.valor).toFixed(2) : "N/A"}</td>
            `;
            tabelaBody.appendChild(linha); // Adiciona a linha à tabela
        });
    } catch (erro) {
        console.error("Erro ao carregar os pagamentos:", erro);
        tabelaBody.innerHTML = `
            <tr>
                <td colspan="3">Nenhum pagamento feito.</td>
            </tr>
        `;
    }
});
