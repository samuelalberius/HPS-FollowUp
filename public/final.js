let checkid = '';
let checkstartdate = '';
let checkenddate = '';
let matrix = [];

getUserInput();

async function getUserInput() {

  const myForm = document.getElementById('userForm');
  myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkid = document.getElementById('id').value;
  checkstartdate = document.getElementById('startdate').value + '0000';
  checkenddate = document.getElementById('enddate').value + '0000';

    getData();
  })
}

async function getData() {

  const response = await fetch('resources/produktionsdata.csv');
  const data = await response.text();
  const table = data.split('\n');

//Selects named rows from CSV based on input ID and dates
  table.forEach(line => {
    const values = line.split(';');
    if(values[0] == checkid && values[2] >= checkstartdate && values[2] <= checkenddate) {
      matrix.push(values.slice(10,58));
    }
  })

//Isolates wanted values from selected rows
  for (var i = 0; i < matrix.length; i++) {
    var temp = [];
    for (var j = 0; j < matrix[i].length; j = j + 2) {
      temp.push(matrix[i][j]);
    }
    matrix[i] = temp
  }

//Converts arrays of comma-denoted values to readable values for graph-input
  matrix.forEach( row => {
    row.forEach( index => {
      index = index.replace(/,/,'.');
      row.push(index);
    })
    row.splice(0,24);
  })
  matrix.forEach( row => {
    row.forEach( index => {
      row.push(parseFloat(index));
    })
      row.splice(0,24);
  })

  console.log(matrix);
  drawGraph();

}

function drawGraph() {

  const myChart = document.getElementById('chartLeft').getContext('2d');

  var dataFirst = {
    label: 'this is empty',
    data: matrix[0],
    fill: false,
    borderColor: 'red',
  }

  var dataSecond = {
    label: 'this is empty',
    data: matrix[1],
    fill: false,
    borderColor: 'blue'
  }

  var dataThird = {
    label: 'this is empty',
    data: matrix[2],
    fill: false,
    borderColor: 'green',
  }

  var graphData = {
    labels: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    datasets: [dataFirst, dataSecond, dataThird],
  }

  var chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value, index, values) {
            return value + ' kW'
          }
        }
      }]
    },
    legend: {
      display: false,
    }
  }

  var lineChart = new Chart(myChart, {
    type: 'line',
    data: graphData,
    options: chartOptions,
  })
}
