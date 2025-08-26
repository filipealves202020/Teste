const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método não permitido.' };
    }

    try {
        const data = JSON.parse(event.body);
        const { nome } = data;

        if (!nome) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'O campo "nome" é obrigatório.' })
            };
        }

        const client = await pool.connect();
        const query = 'INSERT INTO nomes(nome) VALUES($1) RETURNING *';
        await client.query(query, [nome]);
        client.release();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Nome salvo com sucesso!' })
        };
    } catch (error) {
        console.error('Erro ao salvar nome:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno do servidor.' })
        };
    }
};
