// Substitua com as suas credenciais do Supabase
const SUPABASE_URL = 'https://ijzjaxkbqrmgdedryunf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqempheGticXJtZ2RlZHJ5dW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNjIxMzAsImV4cCI6MjA3MTgzODEzMH0.UclSoX9Zq6cln1Tgt70ZdyTaSlml98NXv8-Rw7iSczg';

// Inicializa o cliente Supabase
const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Obtém os elementos do DOM
const nomeForm = document.getElementById('nomeForm');
const nomeInput = document.getElementById('nomeInput');
const nomesTabelaBody = document.querySelector('#nomesTabela tbody');

// Adiciona um listener para o evento de submit do formulário
nomeForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    const nome = nomeInput.value.trim();
    if (!nome) {
        alert('Por favor, digite um nome.');
        return;
    }

    try {
        // Insere o nome e a data na tabela do Supabase
        const { data, error } = await supabase
            .from('pessoas') // 'pessoas' é o nome da sua tabela
            .insert([
                { nome: nome, data: new Date().toISOString().split('T')[0] }
            ]);

        if (error) {
            throw error;
        }

        console.log('Nome salvo com sucesso:', data);
        nomeInput.value = ''; // Limpa o campo de input
        fetchNomes(); // Chama a função para atualizar a tabela na página
    } catch (error) {
        console.error('Erro ao salvar o nome:', error.message);
    }
});

// Função para buscar os nomes e popular a tabela
async function fetchNomes() {
    try {
        const { data, error } = await supabase
            .from('pessoas') // 'pessoas' é o nome da sua tabela
            .select('*')
            .order('data', { ascending: false }); // Ordena por data, do mais novo para o mais antigo

        if (error) {
            throw error;
        }

        // Limpa a tabela antes de adicionar os novos dados
        nomesTabelaBody.innerHTML = '';

        // Adiciona cada nome à tabela
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${item.nome}</td><td>${item.data}</td>`;
            nomesTabelaBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar os nomes:', error.message);
    }
}

// Chama a função para carregar os nomes quando a página é carregada
document.addEventListener('DOMContentLoaded', fetchNomes);

