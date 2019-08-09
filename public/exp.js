var readings = [];
var input;
var month_values = [0];

class Readings {
  constructor(id, date, values) {
    this.id = id;
    this.date = date;
    this.values = values;
  }

  get_id() {
    return this.id;
  }

  get_date() {
    return this.date;
  }

  get_yymm() {
    return (this.date[2]+this.date[3]+this.date[4]+this.date[5]);
  }

  get_year() {
    return (this.date[2]+this.date[3]);
  }

  get_values() {
    var temp = [];
    var temp2 = [];
    for (var i = 0; i < this.values.length; i++) {
      if (i%2===0) {
        temp.push(this.values[i].replace(/,/,'.'));
      }
    }
    for (var i = 0; i < temp.length; i++) {
      temp2.push(parseFloat(temp[i]));
    }
    this.values = temp2;
    return this.values;
  }
}

class Input {
  constructor(id, startdate, enddate){
    this.id = id;
    this.startdate = startdate;
    this.enddate = enddate;
  }

  get_id() {
    return this.id;
  }

  get_startdate() {
    return this.startdate;
  }

  get_enddate() {
    return this.enddate;
  }
}

get_user_input();

async function get_user_input() {
  const myForm = document.getElementById('userForm');
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var id = document.getElementById('id').value;
    var startdate = document.getElementById('startdate').value + '0000';
    var enddate = document.getElementById('enddate').value + '0000';

    input = new Input(id, startdate, enddate);

    console.log('Submit registered with following values:');
    console.log('id: ' + id);
    console.log('startdate: ' + startdate);
    console.log('enddate: ' + enddate);

    read_file();
  })
}

async function read_file() {
  const response = await fetch('resources/produktionsdata.csv');
  const data = await response.text();
  var table = data.split('\n');

  var matrix = [];
  readings = []; //resets readings between every submit.

  table.forEach( line => {
    matrix.push(line.split(';'))
  })

  matrix.forEach( line => {
    var id = line[0];
    var date = line[2];
    var values = line.slice(10,58);

    if (id == input.get_id() && date >= input.get_startdate() && date <= input.get_enddate()) {
      reading = new Readings(id, date, values);
      readings.push(reading);
    }
  })

  console.log('done with read_file()');

  reset_month_values();
  compare();
  temp();
  draw_graph();

}

function compare() {
  var index = 0;

  readings[0].get_values().forEach( value => {
    month_values[0] += value;
  })
  var current_day = readings[0].get_yymm();

  for (var i = 1; i < readings.length; i++) {
    if(readings[i].get_yymm() == current_day) {
      console.log('same date');
      readings[i].get_values().forEach( value => {
        month_values[index] += value;
      })
    } else {
      console.log('new date, increasing index');
      index += 1;
      month_values.push(0);
      readings[i].get_values().forEach( value => {
        month_values[index] += value;
      })
    }
    current_day = readings[i].get_yymm();
  }

  for (var i = 0; i < month_values.length; i++) {
      console.log(month_values[i]);
  }

}

function draw_graph() {

  Chart.defaults.global.defaultFontSize = 18;
  const ctx = document.getElementById('power_graph').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['jan','feb','mar','apr','may','jun','jul','aug','sep','okt','nov','dec'],
      datasets: [{
        label: reading.get_year(),
        data: month_values,
        fill: false,
        backgroundColor: '#21233a',
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
              return value + ' kWh';
            }
          }
        }]
      }
    }
  });
}

function reset_month_values() {
  month_values = [0];
}

function get_datasets() {
  var return_data = [];

  return return_data
}

function temp() {

}
