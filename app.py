import os
from flask import Flask, request, jsonify, send_from_directory
import psycopg2
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__, static_folder='static')

# Função para obter a conexão com o banco de dados Neon
def get_db_connection():
    conn = psycopg2.connect(os.environ.get('DATABASE_URL'))
    return conn

# Endpoints da API

@app.route('/api/records', methods=['GET'])
def get_records():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM records ORDER BY date DESC;')
    records = cursor.fetchall()
    conn.close()
    return jsonify(records)

@app.route('/api/records', methods=['POST'])
def add_record():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO records (date, quantity, route, driver) VALUES (%s, %s, %s, %s) RETURNING *;',
                   (data['date'], data['quantity'], data['route'], data['driver']))
    new_record = cursor.fetchone()
    conn.commit()
    conn.close()
    return jsonify(new_record), 201

# Endpoint para servir o seu frontend (index.html)
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
