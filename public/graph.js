let checkid = '';
let checkstartdate = '';
let checkenddate = '';

const step2 = [];
const myChart = document.getElementById('chartLeft').getContext('2d');
const xlables = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
                  '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];



document.getElementById("submit").addEventListener("click", getUserInput);



async function makeChart() {



await getData();

const graphLeft = new Chart(myChart, {
  type:'line', //bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data:{
    labels: xlables,
    datasets:[{
      label: '',
      data:,
      fill: false,
      borderWidth: 4,
      borderColor: '#8e5aff',

    }]
  },
  options: {
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
  });

}

async function getData() {

  const response = await fetch('resources/produktionsdata.csv');
  const data = await response.text();
  const table = data.split('\n');

//Selects named rows from CSV based on input ID and dates
  table.forEach(line => {
    const values = line.split(';');
    if(values[0] == checkid && values[2] >= checkstartdate && values[2] <= checkendtdate) {

      step2.push(values.slice(10,58));
    }
  })

//Isolates wanted values from selected rows
  step2.forEach( row => {
    row.forEach( index => {
      if(index == '2') {
        row.splice(row.indexOf('2'), 1)
      }
    })
    row.pop();
  })

//Converts arrays of comma-denoted values to readable values for graph-input
  step2.forEach( row => {
    row.forEach( index => {
      row.push((index.replace(/,/,'.')));
    })
    row.splice(0,24);
  })
  step2.forEach( row => {
    row.forEach( index => {
      row.push(parseFloat(index));
    })
      row.splice(0,24);
  })
  console.log(step2);
}

function getUserInput() {

  const myForm = document.getElementById('userForm');
  myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkid = document.getElementById('id').value;
  checkstartdate = document.getElementById('startdate').value + '0000';
  checkenddate = document.getElementById('enddate').value + '0000';

  getData();

  })
}
