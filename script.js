document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nomeForm');
    const input = document.getElementById('nomeInput');
    const tabelaBody = document.querySelector('#nomesTabela tbody');

    // Função para buscar e exibir os nomes
    async function fetchNomes() {
        try {
            // AQUI MUDOU: O caminho agora é direto para o arquivo JS
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
            // AQUI MUDOU: O caminho agora é direto para o arquivo JS
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
cords')) || [];
        stopRecords.splice(index, 1);
        localStorage.setItem('stopRecords', JSON.stringify(stopRecords));
        loadStopRecords();
    }
}

function clearFormParadas() {
    document.getElementById('date-paradas').value = new Date().toLocaleDateString('en-CA');
    document.getElementById('driver-paradas').value = '';
    document.getElementById('client-paradas').value = '';
    document.getElementById('time-paradas').value = '';
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    // Definir a data de hoje nos campos
    const today = new Date().toLocaleDateString('en-CA');
    document.getElementById('total-date-filter').value = today;
    document.getElementById('date-pacotes').value = today;
    document.getElementById('date-paradas').value = today;

    // Carregar os dados do banco de dados ao iniciar a página
    loadRecords();
    loadStopRecords();
    
    // Configurar os listeners para os botões e filtros
    document.getElementById('save-pacotes').addEventListener('click', addOrUpdateRecord);
    document.getElementById('clear-pacotes').addEventListener('click', clearFormPacotes);
    document.getElementById('filter-date').addEventListener('change', filterRecords);
    document.getElementById('filter-driver').addEventListener('input', filterRecords);

    // Funções da aba de paradas
    document.getElementById('save-paradas').addEventListener('click', saveStopRecord);
    document.getElementById('clear-paradas').addEventListener('click', clearFormParadas);

    // Configuração para alternar entre as abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');

            if (button.dataset.tab === 'pacotes') {
                loadRecords();
            } else if (button.dataset.tab === 'paradas') {
                loadStopRecords();
            }
        });
    });

    // Inicia a página na aba de pacotes
    document.getElementById('pacotes-tab-btn').click();
});
