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
  checkstartdate = document.getElementById('startdate').value;
  checkenddate = document.getElementById('enddate').value;

  console.log('form submitted');

  getData();

  })
}

async function getData() {

  console.log(checkid);
  console.log(checkstartdate);
  console.log(checkenddate);


  const response = await fetch('resources/produktionsdata.csv');
  const data = await response.text();
  const table = data.split('\n');

//Selects named rows from CSV based on input ID and dates
  table.forEach(line => {
    const values = line.split(';');
    if(values[0] == checkid && values[2] >= checkstartdate && values[2] <= checkenddate) {
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
      index = index.replace(/ä/,'.');
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
