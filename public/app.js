getUserInput();
var step2 = [];

 async function getUserInput() {
  const myForm = document.getElementById('form');
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const azi = '&azimuth=' + document.getElementById('azi').value;
    const tilt = '&tilt=' + document.getElementById('tilt').value;
    const size = '&system_capacity=' + document.getElementById('size').value;
    const id = document.getElementById('id').value;
    const startdate = document.getElementById('startdate')
    const enddate = document.getElementById('enddate')
    fetchAPI(azi, tilt, size);
    getData(id, startdate, enddate);
  });
}

function add_values(array) {
	var return_array = [];
	return_array.push(array[0])
	for (i = 1; i < array.length; i++) {
		return_array[i] = array[i] + return_array[i-1];
	}
	return return_array;
}

function create_graph(html_id, graph_labels, data_values, graph_title, border_color, backgroud_color) {
	var ctx = document.getElementById(html_id).getContext('2d');
	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: graph_labels,
			datasets: [
				{
					data: data_values,
					label: graph_title,
					borderColor: border_color,
					borderWidth: 1,
					pointRadius: 0.1,
					backgroundColor: backgroud_color
				}
			]
		},
		options: {
			legend: {
        display: false
    		},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	});
}

function get_labels() {
	graph_labels = [];
	for (i = 0; i < 365; i++) {
		if (i%7 == 0) {
			graph_labels.push(i/7);
		} else {
			graph_labels.push('');
		}
	}
	return graph_labels;
}

async function getData(checkid, checkstartdate, checkenddate) {
	const response = await fetch('resources/produktionsdata.csv');
	const data = await response.text();
	const table = data.split('\n');

	//Selects named rows from CSV based on input ID and dates
	table.forEach(line => {
    const values = line.split(';');
    if (values[0] == checkid) {
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
  	var day = 0;
  	step2.forEach( row => {
    	row.forEach( index => {
      		row.push(parseFloat(index));
    	})
    	day++;
      	row.splice(0,24);
  	})
  	
  	new_array = [];
  	step2.forEach( row => {
  		new_array.push(row.reduce((a,b) => a + b, 0));
  	})
  	console.log(new_array)

  	var graph_values1 = [];
  	for (i = 0; i < 365; i++) {
  		graph_values1.push(new_array[i]);
  	}

  	var graph_values2 = add_values(graph_values1);

	create_graph('csv_data', get_labels(), graph_values1, 'Data från anläggning', '#ff5a5f', 'rgba(0, 0, 0, 0)');
	create_graph('csv_data_added', get_labels(), graph_values2, 'Data från anläggning summerad', '#ff5a5f', 'rgba(0, 0, 0, 0)');

}

async function fetchAPI(size, azi, tilt) {
const entry = 'https://developer.nrel.gov/api/pvwatts/v6.json?api_key=eTeVmnBw263TNfsK9aDa3lXAGpCHf62XOgbOKvx9&array_type=1&module_type=1&losses=10&timeframe=hourly'
var url = entry + '&lon=-121.42' + '&lat=38.54' + size + azi + tilt;

console.log(url);

const response = await fetch(url);
const response_json = await response.json();
const sim_values = response_json.outputs.dc;

var graph_values3 = [];
for (i = 0; i < sim_values.length; i += 24) {
	var part_of_array = sim_values.slice(i, i + 24);
	var sum = 0;
	for(j = 0; j < part_of_array.length; j++) {
		sum += part_of_array[j];
	}
	graph_values3.push(Math.round(sum));
}

graph_values4 = add_values(graph_values3);

create_graph('sim_data', get_labels(), graph_values3, 'Data från simulering', '#ff5a5f', 'rgba(0, 0, 0, 0)');
create_graph('sim_data_added', get_labels(), graph_values4, 'Data från simulering summerad', '#ff5a5f', 'rgba(0, 0, 0, 0)');

}



