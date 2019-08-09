var readings = [];
var input;

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

  get_compare_date() {
    return (this.date[2]+this.date[3]+this.date[4]+this.date[5]);
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
    compare();

}

function compare() {

  var index = 0;
  var month_values = [0,0,0,0,0,0,0,0,0,0,0,0];
  var current_day = readings[i];
  var next_day = readings[i+1];

  for (var i = 0; i < readings.length; i++) {
      var x = readings[i].get_values();
      x.forEach( value => {
        month_values[index] += value;
      })
    }
    console.log(month_values);
    if (current_day.get_compare_date() == next_day.get_compare_date()) {
      console.log('same date');
    } else {
      console.log('different date, adding to index');
      index += 1;
    }

    console.log(month_values);
}
