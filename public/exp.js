var readings = [];
var input;
var data_values = [0];
var x_values = [0];

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

  reset_data_values();
  stacking_values();
  draw_graph();
}

function compare() {
  var index = 0;

  readings[0].get_values().forEach( value => {
    data_values[0] += value;
  })
  var current_day = readings[0].get_yymm();

  for (var i = 1; i < readings.length; i++) {
    if(readings[i].get_yymm() == current_day) {
      console.log('same date');
      readings[i].get_values().forEach( value => {
        data_values[index] += value;
      })
    } else {
      console.log('new date, increasing index');
      index += 1;
      data_values.push(0);
      readings[i].get_values().forEach( value => {
        data_values[index] += value;
      })
    }
    current_day = readings[i].get_yymm();
  }

  for (var i = 0; i < data_values.length; i++) {
      console.log(data_values[i]);
  }

}

function draw_graph() {

  Chart.defaults.global.defaultFontSize = 20;
  Chart.defaults.global.defaultFontColor='black';
  const ctx = document.getElementById('power_graph').getContext('2d');

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: x_values,
      datasets: [{
        label: reading.get_year(),
        data: data_values,
        fill: true,
        backgroundColor: 'rgba(18,15,46,0.2)',//'rgba(33, 35, 58, 0.2)',
        borderWidth: 5,
        borderColor: '#120f2e',
      }]
    },
    options: {
      legend: {
        display: false,
            },
      scales: {
        yAxes: [{
          gridLines: {
                color: "grey",
              },
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
              return value + ' kWh   ';
            }
          }
        }],
        xAxes: [{
          gridLines: {
                color: "white",//"rgba(0, 0, 0, 0)",
                zeroLineColor:"blue"
              },
          ticks: {
            autoSkip: false,
            callback: function(value, index, values) {
              return value;
            }
          }
        }]
      },
      elements: {
        point:{
          radius: 0
        }
      }
    }
  });
}

function reset_data_values() {
  data_values = [0];
  x_values = [0];
}

function stacking_values() {
  var total = 0;
  var index = 0;
  var xvalue = 0;
  var year = 2017;

  for (var i = 0; i < readings.length; i++) {
    readings[i].get_values().forEach( value => {
      if (index % 672 == 0) {
        x_values.push(year + ' v. ' + xvalue + '   ');
        xvalue += 4;
        if (xvalue >= 52) {
          xvalue = 0;
          year++;
        }
      } else {
        x_values.push("");
      }
      index++;
      total += value;
      var rounded = total.toFixed(2);
      data_values.push(parseFloat(rounded));
      })
  }

  data_values.shift();
  x_values.shift();

  console.log(x_values);

}

function loadFile(url, string) {
  loadJSON(url, getData(), string);
}

function gotData(data) {

}
