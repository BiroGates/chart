import express from 'express';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import path from 'path';

// Configuração do Express
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexão com o banco de dados
async function getChartData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'sivt',
    });

    const [rows] = await connection.execute("SELECT price, at FROM stock_price_history WHERE stockId = 'c83b23fa-6e38-11ef-8662-0250d3371c1e' ORDER BY at ASC");
    await connection.end();
    return rows;
}

// Servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para buscar os dados do gráfico
app.get('/dados', async (req, res) => {
    const data = await getChartData();
    res.json(data);
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});