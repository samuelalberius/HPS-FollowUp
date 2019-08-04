let checkid = '';
let checkstartdate = '';
let checkenddate = '';
let step2 = [];

getUserInput();

function getUserInput() {

  const myForm = document.getElementById('userForm');
  myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkid = document.getElementById('id').value;
  checkstartdate = document.getElementById('startdate').value + '0000';
  checkenddate = document.getElementById('enddate').value + '0000';

  console.log('form submitted');

  getData();

  })
}

async function getData() {

  console.log(checkid);
  console.log(checkstartdate);
  console.log(checkenddate);

  console.log(typeof(checkstartdate));


  const response = await fetch('resources/produktionsdata.csv');
  const data = await response.text();
  const table = data.split('\n');

//Selects named rows from CSV based on input ID and dates
  table.forEach(line => {
    const values = line.split(';');
    if(values[0] == checkid && values[2] >= checkstartdate && values[2] <= checkenddate) {
      step2.push(values.slice(10,58));
      console.log(step2.length);
    }
  })

//Isolates wanted values from selected rows
  for (var i = 0; i < step2.length; i++) {
    var temp = []
    for (var j = 0; j < step2[i].length; j = j + 2) {
      temp.push(step2[i][j]);
    }
    step2[i] = temp
  }

//Converts arrays of comma-denoted values to readable values for graph-input
  step2.forEach( row => {
    row.forEach( index => {
      index = index.replace(/,/,'.');
      row.push(index);
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
