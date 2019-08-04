
getData()

async function getData() {
  const response = await fetch('resources/prodtest.csv');
  const data = await response.text();

  

  const table = data.split('\n')
  table.forEach(element => {
  const rows = element.split(';');

  })
}
