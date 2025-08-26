const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT nome, data_criacao FROM nomes ORDER BY data_criacao DESC');
        client.release();
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        };
    } catch (error) {
        console.error('Erro ao buscar nomes:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno do servidor.' })
        };
    }
};
