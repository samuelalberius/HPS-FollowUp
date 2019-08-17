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

async function get_user_input() {
  const myForm = document.getElementById('userForm');
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var id = document.getElementById('id').value;
    var startdate = document.getElementById('startdate').value + '0000';
    var enddate = document.getElementById('enddate').value + '0000';

    new Input(id, startdate, enddate);

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

  table.forEach( line => {
    matrix.push(line.split(';'))
  })

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

  console.log('done with read_file()');

}

get_user_input();
