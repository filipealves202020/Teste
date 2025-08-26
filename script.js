document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nomeForm');
    const input = document.getElementById('nomeInput');
    const tabelaBody = document.querySelector('#nomesTabela tbody');

    // Função para buscar e exibir os nomes
    async function fetchNomes() {
        try {
            const response = await fetch('/.netlify/functions/get-nomes');
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const nomes = await response.json();
            tabelaBody.innerHTML = ''; // Limpa a tabela
            nomes.forEach(item => {
                const row = document.createElement('tr');
                const data = new Date(item.data_criacao).toLocaleString();
                row.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${data}</td>
                `;
                tabelaBody.appendChild(row);
            });
        } catch (error) {
            console.error("Erro ao buscar nomes:", error);
        }
    }

    // Função para salvar um novo nome
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = input.value;
        if (!nome) return;

        try {
            const response = await fetch('/.netlify/functions/add-nome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome })
            });

            if (response.ok) {
                input.value = ''; // Limpa o campo
                await fetchNomes(); // Atualiza a tabela
            } else {
                const error = await response.json();
                alert(`Erro ao salvar: ${error.message}`);
            }
        } catch (error) {
            console.error("Erro ao enviar nome:", error);
            alert("Erro ao enviar nome. Tente novamente.");
        }
    });

    // Chama a função ao carregar a página
    fetchNomes();
});
