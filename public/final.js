
getUserInput();

async function getUserInput() {
  const myForm = document.getElementById('userForm');
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var id = document.getElementById('id').value;
    var startdate = document.getElementById('startdate').value + '0000';
    var enddate = document.getElementById('enddate').value + '0000';

    getData(id, startdate, enddate);
  })
}

//Selects named rows from CSV based on input ID and dates
function findEntries(table, id, startdate, enddate) {
  var matrix = [];

  table.forEach(line => {
    const values = line.split(';');
    if(values[0] == id && values[2] >= startdate && values[2] <= enddate) {
      matrix.push(values.slice(10,58));
    }
  })

  return matrix;
}

//Isolates wanted values from selected rows
function consolidate(matrix){
  for (var i = 0; i < matrix.length; i++) {
    var temp = [];
    for (var j = 0; j < matrix[i].length; j = j + 2) {
      temp.push(matrix[i][j]);
    }
    matrix[i] = temp
  }

  return matrix;
}

//Converts arrays of comma-denoted values to readable values for graph-input
function parse(matrix){
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

  return matrix;
}

async function readFile() {
  const response = await fetch('resources/produktionsdata.csv');
  const data = await response.text();
  var table =  data.split('\n');

  return table;
}

function getData(id, startdate, enddate) {
  readFile().then(data => {
    matrix = parse(consolidate(findEntries(data, id, startdate, enddate)));
    drawGraph(matrix);
    printData(matrix);
  });
}

function graph_data(matrix) {
  var graphs = []

  for (var i = 0; i < matrix.length; i++) {
    graphs[i] = {
      data: matrix[i],
      fill: false,
      borderColor: 'blue',
    }
  }
  return graphs
}

function drawGraph(matrix) {

  const myChart = document.getElementById('power_graph').getContext('2d');
  var dataset = graph_data(matrix);
  var graphData = {
    labels: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    datasets: dataset,
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
  printData(matrix)
}

function printData(matrix) {
  var outputStream = [];
  outputStream.push("<tr><th>Day</th><th>Recorded Data</th>")

  for(var i = 0; i < matrix.length; i++) {
    console.log(matrix[i]);
    outputStream.push("<tr><td style=\"text-align:center;\">" + i + "</td><td style=\"padding: 0 200px 0 40px;\">" + matrix[i] + "</td></tr>");
    }

  document.getElementById("output").innerHTML = outputStream.join("");
}
