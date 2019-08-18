function setup() {
  loadJSON("https://developer.nrel.gov/api/pvwatts/v6.json?api_key=DEMO_KEY&lat=40&lon=-105&system_capacity=4&azimuth=180&tilt=40&array_type=1&module_type=1&losses=10", gotData);
}

function gotData(data) {
  console.log(data);
}

setup();


var key = "cdeab38cd66b010274dbef4ba6939889c8556e7c";
