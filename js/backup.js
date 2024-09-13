let ctx = document.getElementById('chart').getContext('2d');

Chart.defaults.global.defaultFontFamily = 'Roboto'

let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            borderColor: [
                'rgba(41, 128, 185,1.0)',
                'rgba(41, 128, 185,1.0)',
                'rgba(52, 73, 94,1.0)',
                'rgba(44, 62, 80,1.0)',
                'rgba(149, 165, 166,1.0)',
                'rgba(127, 140, 141,1.0)'
            ],
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },
    options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js Line Chart'
          }
        }
      },
});



const goodNewsInfluencer = Number(document.getElementById('inputTop')) ?? 1;
const badNewsInfluencer = 10;
let badNews = false;
let goodNews = false;

const addData = () => {
    let sizeData = chart.data.datasets[0].data.length

    if (sizeData === 0) {
        chart.data.datasets[0].data[sizeData] = Math.random() * 100
    }
    else {
        const randomNumber = Number((Math.random() * 10));
        const lastStockPrice = chart.data.datasets[0].data[sizeData - 1];
        let data = chart.data.datasets[0].data;


        // vai subir
        if (randomNumber.toFixed(0) % 2 === 0) {
            
            if (goodNews) {
                data.push(Number(lastStockPrice + randomNumber * ( lastStockPrice * .1 )));
            }
            
            else {
                data.push(Number(lastStockPrice + randomNumber));
            }
        }

        // Going down
        if (randomNumber.toFixed(0) % 2 !== 0) {
            if (badNews) {
                data.push(Number(lastStockPrice - randomNumber * ( lastStockPrice * .1 )));
            }
            else {
                data.push(Number(lastStockPrice - randomNumber));
            }
        }
    }
    
    chart.data.labels[sizeData] = `New Data ${sizeData + 1}`
    chart.update()
}

const addBadNews = () => {
    badNews = true;
    console.log(badNewsInfluencer);
}

const addGoodNews = () => {
    goodNews = true;
    console.log(badNewsInfluencer);
}


const removeBadNews = () => {
    badNews = false;
}

const removeGoodNews = () => {
    goodNews = false;
}


setInterval(() => addData(), 500);