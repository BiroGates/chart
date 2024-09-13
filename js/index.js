import pool from "./database";

let stockChart;
let simulationInterval;
let currentPrices = [];
let labels = [];
let S0 = 1234;
let dt = 1 / 252; // Passo de tempo (1 dia de negociação)
let sigma = 0.2;
let mu = 0.05; // Tendência inicial ( alterar esse valor pra cair ou subir )
let T = 200; // Duração em anos



let teste = [];

function generateStockPrice(S0, mu, sigma, dt, previousPrice) {
    const dW = Math.sqrt(dt) * randn();
    const dS = mu * previousPrice * dt + sigma * previousPrice * dW;
    return previousPrice + dS;
}

function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converte [0,1) para (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function updateMu() {
    mu = parseFloat(document.getElementById('mu').value);
}

function updateTrend() {
    const trend = document.getElementById('trend').value;
    if (trend === 'up') {
        mu = 0.1; // Tendência de alta
    } else if (trend === 'down') {
        mu = -0.1; // Tendência de baixa
    } else {
        mu = 0.05; // Tendência neutra
    }
    document.getElementById('mu').value = mu; // Atualiza o valor do input de mu
}
async function updateChart() {
    const newPrice = generateStockPrice(S0, mu, sigma, dt, currentPrices[currentPrices.length - 1]);

    
    labels.push(`Dia ${labels.length + 1}`);

    const maxLength = Math.ceil(T * 252);
    if (labels.length > maxLength) {
        labels.shift();
        currentPrices.shift();
    }

    const [rows] = await pool.query("SELECT currentPrice FROM stocks WHERE id = 'c83b23fa-6e38-11ef-8662-0250d3371c1e' ");
    console.log(rows[0].price);
    currentPrices.push(value);

    stockChart.data.labels = labels;
    stockChart.data.datasets[0].data = currentPrices;
    stockChart.update('none');
}

function startSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }

    currentPrices = [S0];
    labels = ['Dia 1'];

    const ctx = document.getElementById('stockChart').getContext('2d');
    if (stockChart) {
        stockChart.destroy();
    }


    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Preço da Ação',
                data: teste.reverse(),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            animation: {
                duration: 0,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Tempo (Dias de Negociação)'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Preço'
                    }
                }
            }
        }
    });
    
    simulationInterval = setInterval(updateChart, 5000); // Atualiza a cada 2 segundos
}

function stopSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
}

startSimulation();

updateTrend();