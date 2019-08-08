read_file();

async function read_file() {
  const response = await fetch('resources/produktionsdata.csv');
  const data = await response.text();
  var table =  data.split('\n');

  var matrix = [];
  var readings = [];

  table.forEach( line => {
    matrix.push(line.split(';'))
  })

  matrix.forEach( line => {
    var id = line[0];
    var date = parseFloat(line[2]);
    var values = line.slice(10,58);
    reading = new Readings(id, date, values);
    readings.push(reading);
  })

  console.log(readings[9000].get_values());
}

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
